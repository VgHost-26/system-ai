using Newtonsoft.Json;
using System.Reflection;
using System.Xml.Linq;
using SystemAI.Controllers;
using SystemAI.Interfaces;

namespace SystemAI.Services
{
    public class AlgorithmService : IAlgorithmService
    {

        private readonly string _algorithmsFolderPath;
        private readonly AlgorithmLoader _algorithmLoader;
        private readonly string _fitnessFunctionPath;
        private readonly FitnesFunctionLoader _fitnesFunctionLoader;

        public AlgorithmService(string algorithmsFolderPath, AlgorithmLoader algorithmLoader, string fitnessFunctionPath, FitnesFunctionLoader fitnesFunctionLoader)
        {
            _algorithmsFolderPath = algorithmsFolderPath;
            _algorithmLoader = algorithmLoader;
            _fitnessFunctionPath = fitnessFunctionPath;
            _fitnesFunctionLoader = fitnesFunctionLoader;
        }

        public IEnumerable<string> GetAllAlgorithmNames()
        {
            return Directory.GetFiles(_algorithmsFolderPath, "*.dll").Select(Path.GetFileNameWithoutExtension);
        }

        public (object, Type) LoadAlgorithm(string algorithmName)
        {
            string dllPath = Path.Combine(_algorithmsFolderPath, algorithmName + ".dll");
            return _algorithmLoader.LoadAlgorithm(dllPath);
        }

        public List<object> LoadFitnessFunctions(string[] functionNames)
        {
            string[] dllPaths = new string[functionNames.Length];
            for (int i = 0; i < functionNames.Length; i++)
            {
                string dllPath = Path.Combine(_fitnessFunctionPath, functionNames[i] + ".dll");
                dllPaths[i] = dllPath;
            }

            return _fitnesFunctionLoader.LoadFitnesFunctions(dllPaths);
        }

        public object RunAlgorithm(string algorithmName, List<FitnessFunctionRequest> fitnessFunctionsRequest, params double[] parameters)
        {
            (var optimizationAlgorithm, var delegateFunction) = LoadAlgorithm(algorithmName);
            if (optimizationAlgorithm == null)
            {
                throw new InvalidOperationException("Algorithm could not be loaded.");
            }
            else if (delegateFunction == null)
            {
                throw new InvalidOperationException("Delegate Function could not be loaded.");
            }

            var fitnessFunctionNames = fitnessFunctionsRequest.Select(request => request.Name).ToArray();
            var fitnessFunctions = LoadFitnessFunctions(fitnessFunctionNames);

            if (fitnessFunctions == null)
            {
                throw new InvalidOperationException("Fitness functions could not be loaded.");
            }

            var domains = new List<double[,]>();

            foreach (var request in fitnessFunctionsRequest)
            {
                var deserializedDomain = DeserializeDomain(request.Domain);
                domains.Add(deserializedDomain);
            }
            // double[,] domain = DeserializeDomain(DomainSerialized);


            // Wypisywanie wartości domain
            /*Console.WriteLine("Domain Values:");
            for (int i = 0; i < domain.GetLength(0); i++)
            {
                for (int j = 0; j < domain.GetLength(1); j++)
                {
                    Console.Write(domain[i, j] + " ");
                }
                Console.WriteLine();
            }*/

            // Wypisywanie wartości parameters
            Console.WriteLine("Parameters:");
            foreach (var param in parameters)
            {
                Console.Write(param + " ");
            }
            Console.WriteLine();

            var solve = optimizationAlgorithm.GetType().GetMethod("Solve");

            List<object> response = new List<object> { };

            for (int i = 0; i < fitnessFunctions.Count(); i++)
            {
                var calculateMethodInfo = fitnessFunctions[i].GetType().GetMethod("Function");
                var calculate = Delegate.CreateDelegate(delegateFunction, fitnessFunctions[i], calculateMethodInfo);
                solve.Invoke(optimizationAlgorithm, new object[] { calculate, domains[i], parameters });

                var XBest = optimizationAlgorithm.GetType().GetProperty("XBest");
                var FBest = optimizationAlgorithm.GetType().GetProperty("FBest");
                var NumberOfEvaluationFitnessFunction = optimizationAlgorithm.GetType().GetProperty("NumberOfEvaluationFitnessFunction");

                var XBestValue = (double[])XBest.GetValue(optimizationAlgorithm);
                var FBestValue = (double)FBest.GetValue(optimizationAlgorithm);
                var NumberOfEvaluationFitnessFunctionValue = (int)NumberOfEvaluationFitnessFunction.GetValue(optimizationAlgorithm);

                Console.WriteLine(XBestValue);
                Console.WriteLine(FBestValue);
                Console.WriteLine(NumberOfEvaluationFitnessFunctionValue);

                var algorithmResult = new
                {
                    XBestValue = XBestValue,
                    FBestValue = FBestValue,
                    NumberOfEvaluationFitnessFunctionValue = NumberOfEvaluationFitnessFunctionValue
                };

                response.Add(algorithmResult);

                //Generowanie pdfa
               /* var pdfReportGenerator = optimizationAlgorithm.GetType().GetProperty("pdfReportGenerator");
                var GenerateReport = pdfReportGenerator.GetType().GetMethod("GenerateReport");

                var ParamsInfo = optimizationAlgorithm.GetType().GetProperty("ParamsInfo");
                var path = Path.Combine(Directory.GetCurrentDirectory(), "Reports");
                GenerateReport.Invoke(pdfReportGenerator, new object[] { path, XBest, FBest, NumberOfEvaluationFitnessFunction, ParamsInfo });*/

                //usuwanie json
                /* 
                 string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Data");

                 // Pobiera wszystkie pliki .json w folderze
                 string[] jsonFiles = Directory.GetFiles(folderPath, "*.json");

                 // Iteruje przez wszystkie znalezione pliki i je usuwa
                 foreach (string file in jsonFiles)
                 {
                     File.Delete(file);
                 }*/

            }

            object resposneObject = new { response };

            return resposneObject;
        }

        public object RunAlgorithms(List<AlgorithmRequest> algorithms, FitnessFunctionRequest fitnessFunctionName, double population, double iteration)
        {
            throw new NotImplementedException();
        }

        // Nowe metody
        public void AddAlgorithm(string algorithmName, byte[] algorithmData)
        {
            string filePath = Path.Combine(_algorithmsFolderPath, algorithmName + ".dll");
            File.WriteAllBytes(filePath, algorithmData);
        }

        public void UpdateAlgorithm(string algorithmName, byte[] algorithmData)
        {
            string filePath = Path.Combine(_algorithmsFolderPath, algorithmName + ".dll");
            if (File.Exists(filePath))
            {
                File.WriteAllBytes(filePath, algorithmData);
            }
            else
            {
                throw new FileNotFoundException("Algorithm DLL not found.");
            }
        }

        public void DeleteAlgorithm(string algorithmName)
        {
            string filePath = Path.Combine(_algorithmsFolderPath, algorithmName + ".dll");
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            else
            {
                throw new FileNotFoundException("Algorithm DLL not found.");
            }
        }

        public List<ParamInfoResponse> GetParamsInfo(string algorithmName)
        {
            (var optimizationAlgorithm, var delegateFunction) = LoadAlgorithm(algorithmName);
            if (optimizationAlgorithm == null)
            {
                throw new InvalidOperationException("Algorithm could not be loaded.");
            }
            else if (delegateFunction == null)
            {
                throw new InvalidOperationException("Delegate Function could not be loaded.");
            }

            // Pobieranie właściwości ParamsInfo          

            var paramsInfoArray = (Array)optimizationAlgorithm.GetType().GetProperty("ParamsInfo").GetValue(optimizationAlgorithm);

            List<ParamInfoResponse> paramInfoRequests = new List<ParamInfoResponse>();

            foreach (var paramInfo in paramsInfoArray)
            {
                string _name = (string)paramInfo.GetType().GetProperty("Name").GetValue(paramInfo);
                string _description = (string)paramInfo.GetType().GetProperty("Description").GetValue(paramInfo);
                double _upperBoundary = (double)paramInfo.GetType().GetProperty("UpperBoundary").GetValue(paramInfo);
                double _lowerBoundary = (double)paramInfo.GetType().GetProperty("LowerBoundary").GetValue(paramInfo);
                //double _step = (double)paramInfo.GetType().GetProperty("Step").GetValue(paramInfo);


                paramInfoRequests.Add(new ParamInfoResponse(_name, _description, _upperBoundary, _lowerBoundary));               
            }

            Console.WriteLine(paramInfoRequests);
            return paramInfoRequests;

        }

        private double[,] DeserializeDomain(string serializedDomain)
        {
            // Deserializacja do listy list lub innego odpowiedniego formatu
            var domainList = JsonConvert.DeserializeObject<List<List<double>>>(serializedDomain);

            // Konwersja listy list na tablicę dwuwymiarową
            int rows = domainList.Count;
            int cols = domainList[0].Count;
            double[,] domainArray = new double[rows, cols];

            for (int i = 0; i < rows; i++)
            {
                for (int j = 0; j < cols; j++)
                {
                    domainArray[i, j] = domainList[i][j];
                }
            }

            return domainArray;
        }

        
    }

    public class AlgorithmLoader
    {
        public (object, Type) LoadAlgorithm(string dllPath)
        {
            object instance = null;
            Type delegateFunction = null;
            Assembly assembly = Assembly.LoadFrom(dllPath);
            foreach (Type t in assembly.GetTypes())
            {
                //Console.WriteLine(t.FullName);
                // Szukanie klas ktore implementuja IOptimizationAlgorithm
                if (t.GetInterface("IOptimizationAlgorithm", true) != null)
                {
                    Console.WriteLine("Found Type: {0}", t.FullName);

                    instance = Activator.CreateInstance(t);

                    break;
                }
            }

            delegateFunction = assembly.GetType("Archimedes.fitnessFunction");

            return (instance, delegateFunction);
            //throw new InvalidOperationException("No valid algorithm found in DLL.");
        }
    }

    public class FitnesFunctionLoader
    {
        /*public object LoadFitnesFunction(string dllPath)
        {
            object instance = null;
            Assembly assembly = Assembly.LoadFrom(dllPath);
            foreach (Type t in assembly.GetTypes())
            {
                if (t.GetInterface("FitnesFunction", true) != null)
                {
                    Console.WriteLine("Found Fitnes Function: {0}", t.FullName);

                    instance = Activator.CreateInstance(t);

                    break;
                }
            }
            return instance;
        }*/
        public List<object> LoadFitnesFunctions(string[] fitnessFunctionsNames)
        {
            List<object> fitnessFunctions = new List<object>();

            foreach (var fitnessFunction in fitnessFunctionsNames)
            {
                Assembly assembly = Assembly.LoadFrom(fitnessFunction);

                foreach (Type t in assembly.GetTypes())
                {
                    if (t.GetInterface("FitnesFunction", true) != null)
                    {
                        Console.WriteLine("Found Fitnes Function: {0}", t.FullName);

                        var instance = Activator.CreateInstance(t);

                        fitnessFunctions.Add(instance);
                    }
                }
            }

            return fitnessFunctions;
        }
    }

    public class ParamInfoResponse
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public double UpperBoundary { get; set; }
        public double LowerBoundary { get; set; }
        

        public ParamInfoResponse(string _name, string _description, double _uppderBoundary, double _lowerBoundary)
        {
            Name = _name;
            Description = _description;
            UpperBoundary = _uppderBoundary;
            LowerBoundary = _lowerBoundary;
        }

    }
}


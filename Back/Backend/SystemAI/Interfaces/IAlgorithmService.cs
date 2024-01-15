using System.Security.Cryptography;
using SystemAI.Controllers;

namespace SystemAI.Interfaces
{
    public interface IAlgorithmService
    {
        IEnumerable<string> GetAllAlgorithmNames();
        (object, Type) LoadAlgorithm(string algorithmName);
        public List<object> LoadFitnessFunctions(string[] functionNames);
        object RunAlgorithm(string algorithmName, List<FitnessFunctionRequest> fitnessFunctionNames, params double[] parameters); // Uruchamia algorytm

        object RunAlgorithms(string[] algorithmsNames, FitnessFunctionRequest fitnessFunctionName);

        // Nowe metody
        void AddAlgorithm(string algorithmName, byte[] algorithmData);
        void UpdateAlgorithm(string algorithmName, byte[] algorithmData);
        void DeleteAlgorithm(string algorithmName);
        void GetParamsInfo(string algorithmName);

    }

}

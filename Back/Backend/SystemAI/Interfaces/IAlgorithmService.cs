using System.Security.Cryptography;
using SystemAI.Controllers;

namespace SystemAI.Interfaces
{
    public interface IAlgorithmService
    {
        IEnumerable<string> GetAllAlgorithmNames();
        //IOptimizationAlgorithm LoadAlgorithm(string algorithmName);
        (object, Type) LoadAlgorithm(string algorithmName);
        public List<object> LoadFitnessFunctions(string[] functionNames);
        object RunAlgorithm(string algorithmName, List<FitnessFunctionRequest> fitnessFunctionNames, params double[] parameters); // Uruchamia algorytm

        // Nowe metody
        void AddAlgorithm(string algorithmName, byte[] algorithmData);
        void UpdateAlgorithm(string algorithmName, byte[] algorithmData);
        void DeleteAlgorithm(string algorithmName);

    }

}

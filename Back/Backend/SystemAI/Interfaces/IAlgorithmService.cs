﻿using System.Security.Cryptography;
using SystemAI.Controllers;
using SystemAI.Services;

namespace SystemAI.Interfaces
{
    public interface IAlgorithmService
    {
        IEnumerable<string> GetAllAlgorithmNames();
        (object, Type) LoadAlgorithm(string algorithmName);
        public List<object> LoadFitnessFunctions(string[] functionNames);
        object RunAlgorithm(string algorithmName, List<FitnessFunctionRequest> fitnessFunctionNames, params double[] parameters); // Uruchamia algorytm

        object RunAlgorithms(List<AlgorithmRequest> algorithms, FitnessFunctionRequest fitnessFunctionName, double population, double iteration);

        // Nowe metody
        void AddAlgorithm(string algorithmName, byte[] algorithmData);
        void UpdateAlgorithm(string algorithmName, byte[] algorithmData);
        void DeleteAlgorithm(string algorithmName);
        List<ParamInfoResponse> GetParamsInfo(string algorithmName);

    }

}

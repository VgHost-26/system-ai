using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Security.Cryptography;
using SystemAI.Interfaces;
using SystemAI.Services;

namespace SystemAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlgorithmsController : ControllerBase
    {
        
        private readonly IAlgorithmService _algorithmService;
        private readonly IFitnessFunctionService _fitnessFunction;

        public AlgorithmsController(IAlgorithmService algorithmService, IFitnessFunctionService fitnessFunctionService)
        {
            _algorithmService = algorithmService;
            _fitnessFunction = fitnessFunctionService;
        }

        // GET: api/algorithms
        [HttpGet]
        public ActionResult<IEnumerable<string>> GetAllAlgorithms()
        {
            var algorithms = _algorithmService.GetAllAlgorithmNames();
            return Ok(algorithms);
        }


        // POST: api/algorithms/run
        [HttpPost("run")]
        public ActionResult RunAlgorithm([FromBody] AlgorithmRunRequest request)
        {
            try
            {
                var result = _algorithmService.RunAlgorithm(request.AlgorithmName, request.FitnessFunctions, request.Parameters);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Nowe metody
        [HttpPost("addAlgorithm")]
        public async Task<IActionResult> AddAlgorithm([FromQuery] string name, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file with algorithm provided.");
            }

            try
            {
                byte[] algorithmData;
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    algorithmData = memoryStream.ToArray();
                }

                _algorithmService.AddAlgorithm(name, algorithmData);
                return Ok("Algorithm added successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateAlgorithm/{name}")]
        public IActionResult UpdateAlgorithm(string name, [FromBody] byte[] algorithmData)
        {
            try
            {
                _algorithmService.UpdateAlgorithm(name, algorithmData);
                return Ok("Algorithm updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("deleteAlgorithm/{name}")]
        public IActionResult DeleteAlgorithm(string name)
        {
            try
            {
                _algorithmService.DeleteAlgorithm(name);
                return Ok("Algorithm deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Fitness function

        [HttpPost("addFitnessFunction")]
        public async Task<IActionResult> AddFitnessFunction([FromQuery] string name, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file with fitness function provided.");
            }

            try
            {
                byte[] fitnessFunctionData;
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    fitnessFunctionData = memoryStream.ToArray();
                }

                _fitnessFunction.AddFitnessFunction(name, fitnessFunctionData);
                return Ok("Fitness funtion added successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }


    public class FitnessFunctionRequest
    {
        public string Name { get; set; }
        public string Domain { get; set; } // Dane jako string JSON
    }

    public class AlgorithmRunRequest
    {
        public string AlgorithmName { get; set; }
        public List<FitnessFunctionRequest> FitnessFunctions { get; set; }
        public double[] Parameters { get; set; }
    }
    /*public class AlgorithmRunRequest
    {
        //public string FitnessFunctionName { get; set; } 
        public string[] FitnessFunctionNames { get; set; } 
        public string DomainSerialized { get; set; } // Dane jako string JSON
        public double[] Parameters { get; set; }
    }*/


}

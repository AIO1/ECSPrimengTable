using Microsoft.AspNetCore.Mvc;
using ECSPrimengTableExample.DTOs;
using Swashbuckle.AspNetCore.Annotations;
using System.Globalization;
using ECS.PrimengTable.Models;
using ECSPrimengTableExample.Interfaces;

namespace ECSPrimengTableExample.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase {
        private readonly ITestService _service;
        public TestController(ITestService service) {
            _service = service;
        }

        #region HttpGet - GetTableConfiguration
        [HttpGet("[action]")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Retrieves all information needed to init the table.",
            "This API function will get all the table configuration needed."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(TableConfigurationModel))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public IActionResult GetTableConfiguration() {
            try {
                return Ok(_service.GetTableConfiguration()); // Get all the table configuration information to be returned
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion

        #region HttpPost - GetTableData
        [HttpPost("[action]")]
        [Consumes("application/json")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Retrieves all information to be show in the table for Test.",
            "This API function will get all the data that needs to be shown in Test applying all requested rules."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(TablePagedResponseModel))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Returned if the items per page is not allowed or no columns have been specified.", typeof(string))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public IActionResult GetTableData([FromBody] TableQueryRequestModel inputData) {
            try {
                (bool success, TablePagedResponseModel data) = _service.GetTableData(inputData);
                if(!success) {
                    return BadRequest("Invalid items per page");
                }
                return Ok(_service.GetTableData(inputData));
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion

        #region HttpGet - GetEmploymentStatus
        [HttpGet("[action]")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Retrieves all possible employment status.",
            "This API function will return all employment status."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(List<EmploymentStatusDto>))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public async Task<IActionResult> GetEmploymentStatus() {
            try {
                return Ok(await _service.GetEmploymentStatusesCategories());
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion

        #region HttpPost - GetViews
        [HttpPost("[action]")]
        [Consumes("application/json")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Get views of a table for a specific user.",
            "This API function will retrieve all views for a specific table an user. User is retrieved through JWT (in this example is not configured and it has been hardcoded)."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(List<ViewDataModel>))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public async Task<IActionResult> GetViews([FromBody] ViewLoadRequestModel request) {
            try {
                string username = "User test"; // This username should be retrieved from a token. This is just for example purposes and it has been hardcoded
                return Ok(await _service.GetViews(username, request));
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion

        #region HttpPost - SaveViews
        [HttpPost("[action]")]
        [Consumes("application/json")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Saves changes to the tables views of a user.",
            "This API function will save all changes made to a view. User is retrieved through JWT (in this example is not configured and it has been hardcoded)."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(string))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public async Task<IActionResult> SaveViews([FromBody] ViewSaveRequestModel request) {
            try {
                string username = "User test"; // This username should be retrieved from a token. This is just for example purposes and it has been hardcoded
                await _service.SaveViews(username, request);
                return Ok("Views saved OK");
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion

        #region HttpPost - GenerateExcelReport
        [HttpPost("[action]")]
        [Consumes("application/json")]
        [Produces("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")]
        public IActionResult GenerateExcel([FromBody] ExcelExportRequestModel inputData) {
            try {
                (bool success, byte[]? file, string errorMsg) = _service.GenerateExcelReport(inputData);
                if(!success) {
                    return BadRequest(errorMsg);
                }
                return File(file!, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", inputData.Filename);
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion

        #region HttpGet - TimezoneList
        [HttpGet("[action]")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Returns list of available timezones.",
            "This API function will return all available timezones."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(List<dynamic>))]
        public IActionResult TimezoneList() {
            CultureInfo currentCulture = CultureInfo.CurrentCulture;
            CultureInfo.CurrentCulture = new CultureInfo("en-US");
            var timeZones = TimeZoneInfo.GetSystemTimeZones()
                .Where(tz => !tz.Id.Contains("UTC"))
                .Select(tz => new {
                    tz.DisplayName,
                    tz.Id
                })
                .OrderBy(tz => tz.DisplayName)
                .ToList();
            CultureInfo.CurrentCulture = currentCulture;
            return Ok(timeZones);
        }
        #endregion
    }
}
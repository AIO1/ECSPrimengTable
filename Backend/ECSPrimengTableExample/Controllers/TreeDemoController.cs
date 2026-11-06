using Data.PrimengTableReusableComponent;
using ECS.PrimengTable.Models;
using ECS.PrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using Microsoft.AspNetCore.Mvc;
using Models.PrimengTableReusableComponent;

namespace ECSPrimengTableExample.Controllers;

[ApiController]
[Route("TreeDemo")]
public class TreeDemoController(primengTableReusableComponentContext context) : ControllerBase {
    public const string TableKey = "TreeDemo";
    private const string DemoUsername = "User test";
    private static readonly TreeQueryOptions Options = new() { RootParentId = 0 };

    [HttpGet("GetTableConfiguration")]
    public IActionResult GetTableConfiguration() => Ok(EcsPrimengTableService.GetTableConfiguration<TreeDemoDto>());

    [HttpPost("GetTableData")]
    public IActionResult GetTableData([FromBody] TreeQueryRequestModel request) {
        if (!EcsPrimengTableService.ValidateItemsPerPageAndCols(request.PageSize, request.Columns))
            return BadRequest("Invalid page size or columns.");
        try {
            return Ok(EcsPrimengTableService.PerformTreeQuery(request, TreeDemoData.Create(), Options));
        } catch (ArgumentException exception) {
            return BadRequest(exception.Message);
        }
    }

    [HttpPost("GetSelectionKeys")]
    public IActionResult GetSelectionKeys([FromBody] TableQueryRequestModel request) {
        if (!EcsPrimengTableService.ValidateItemsPerPageAndCols(request.PageSize, request.Columns))
            return BadRequest("Invalid page size or columns.");
        try {
            return Ok(EcsPrimengTableService.GetTreeSelectionKeys(request, TreeDemoData.Create(), Options));
        } catch (ArgumentException exception) {
            return BadRequest(exception.Message);
        }
    }

    [HttpPost("GenerateExcel")]
    public IActionResult GenerateExcel([FromBody] TreeExcelExportRequestModel request) {
        if (!EcsPrimengTableService.ValidateItemsPerPageAndCols(request.PageSize, request.Columns))
            return BadRequest("Invalid page size or columns.");
        var result = EcsPrimengTableService.GenerateTreeExcelReport(request, TreeDemoData.Create(), Options);
        return result.success && result.reportFile != null
            ? File(result.reportFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                string.IsNullOrWhiteSpace(request.Filename) ? "tree.xlsx" : request.Filename)
            : BadRequest(result.statusMessage);
    }

    [HttpPost("GetViews")]
    public async Task<IActionResult> GetViews([FromBody] ViewLoadRequestModel request) {
        try {
            return Ok(await EcsPrimengTableService.GetViewsAsync<TableView, string>(context, DemoUsername, TableKey));
        } catch (Exception) {
            return Problem("The tree views store is unavailable.");
        }
    }

    [HttpPost("SaveViews")]
    public async Task<IActionResult> SaveViews([FromBody] ViewSaveRequestModel request) {
        if (request.Views == null || request.Views.Count > 10 || request.Views.Any(view =>
            view == null || string.IsNullOrWhiteSpace(view.ViewAlias) || string.IsNullOrWhiteSpace(view.ViewData)))
            return BadRequest("Invalid views.");
        if (request.Views.Select(view => view.ViewAlias).Distinct(StringComparer.OrdinalIgnoreCase).Count() != request.Views.Count)
            return BadRequest("View aliases must be unique.");
        try {
            await EcsPrimengTableService.SaveViewsAsync<TableView, string>(context, DemoUsername, TableKey, request.Views);
            return new JsonResult("Views saved OK");
        } catch (Exception) {
            return Problem("The tree views could not be saved.");
        }
    }
}

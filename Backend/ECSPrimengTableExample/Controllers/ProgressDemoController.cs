using ECS.PrimengTable.Models;
using ECS.PrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace ECSPrimengTableExample.Controllers;

/// <summary>A separate, deterministic progress example that does not require the people database.</summary>
[ApiController]
[Route("ProgressDemo")]
public class ProgressDemoController : ControllerBase {
    private static IQueryable<ProgressDemoDto> Rows => new decimal?[] { 0, 15.5m, 35, 75, 100, null, -10, 125 }
        .Select((value, index) => new ProgressDemoDto {
            RowID = index + 1, Progress = value, Custom = value, Disabled = value, Plain = value,
            Text = value == null ? "Sin progreso informado" : $"Ejemplo {index + 1}",
            Tip = value == null ? "Sin información" : $"Tarea {index + 1}: {value} de 100 unidades completadas"
        }).AsQueryable();

    [HttpGet("GetTableConfiguration")]
    public IActionResult GetTableConfiguration() => Ok(EcsPrimengTableService.GetTableConfiguration<ProgressDemoDto>());

    [HttpPost("GetTableData")]
    public IActionResult GetTableData([FromBody] TableQueryRequestModel request) {
        if (!EcsPrimengTableService.ValidateItemsPerPageAndCols(request.PageSize, request.Columns))
            return BadRequest("Invalid page size or columns.");
        return Ok(EcsPrimengTableService.PerformDynamicQuery(request, Rows));
    }

    [HttpPost("GenerateExcel")]
    public IActionResult GenerateExcel([FromBody] ExcelExportRequestModel request) {
        var result = EcsPrimengTableService.GenerateExcelReport(request, Rows);
        return result.success && result.reportFile != null
            ? File(result.reportFile, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "progress.xlsx")
            : BadRequest(result.statusMessage);
    }
}

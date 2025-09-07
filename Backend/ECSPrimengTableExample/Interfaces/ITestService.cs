using ECS.PrimengTable.Models;
using ECSPrimengTableExample.DTOs;
namespace ECSPrimengTableExample.Interfaces {
    public interface ITestService {
        TableConfigurationModel GetTableConfiguration();
        TablePagedResponseModel GetTableData(TableQueryRequestModel inputData);
        Task<List<EmploymentStatusDto>> GetEmploymentStatusesCategories();
        Task<List<ViewDataModel>> GetViews(string username, ViewLoadRequestModel request);
        Task SaveViews(string username, ViewSaveRequestModel request);
        (bool success, byte[]? file, string errorMsg) GenerateExcelReport(ExcelExportRequestModel inputData);
    }
}
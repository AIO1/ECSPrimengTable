using Data.PrimengTableReusableComponent;
using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Models;
using ECS.PrimengTable.Services;
using ECSPrimengTableExample.DTOs;
using ECSPrimengTableExample.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace ECSPrimengTableExample.Services {
    public class TestService : ITestService {
        private readonly ITestRepository _repo;

        private static readonly MethodInfo stringDateFormatMethod = typeof(MyDBFunctions).GetMethod(nameof(MyDBFunctions.FormatDateWithCulture), [typeof(DateTime), typeof(string), typeof(string), typeof(string)])!; // Needed import for being able to perform global search on dates

        private readonly List<string> columnsToOrderByDefault = ["Age", "EmploymentStatusName"];
        private readonly List<ColumnSort> columnsToOrderByOrderDefault = [ColumnSort.Descending, ColumnSort.Ascending];

        public TestService(ITestRepository repository) {
            _repo = repository;
        }

        public TableConfigurationModel GetTableConfiguration() {
            return EcsPrimengTableService.GetTableConfiguration<TestDto>();
        }

        public (bool success, TablePagedResponseModel data) GetTableData(TableQueryRequestModel inputData) {
            if(!EcsPrimengTableService.ValidateItemsPerPageAndCols(inputData.PageSize, inputData.Columns)) { // Validate the items per page size and columns
                return (false, null!);
            }
            return (true,EcsPrimengTableService.PerformDynamicQuery(inputData, GetBaseQuery(), stringDateFormatMethod, columnsToOrderByDefault, columnsToOrderByOrderDefault));
        }

        public async Task<List<EmploymentStatusDto>> GetEmploymentStatusesCategories() {
            return await _repo.GetEmploymentStatusCategories()
                .Select(t => new EmploymentStatusDto {
                    ID = t.Id,
                    StatusName = t.StatusName,
                    ColorR = t.ColorR,
                    ColorG = t.ColorG,
                    ColorB = t.ColorB
                }).ToListAsync();
        }

        public async Task<List<ViewDataModel>> GetViews(string username, ViewLoadRequestModel request) {
            return await _repo.GetViewsAsync(username, request);
        }

        public async Task SaveViews(string username, ViewSaveRequestModel request) {
            await _repo.SaveViewsAsync(username, request);
        }

        public (bool success, byte[]? file, string errorMsg) GenerateExcelReport(ExcelExportRequestModel inputData) {
            return EcsPrimengTableService.GenerateExcelReport(inputData, GetBaseQuery(), stringDateFormatMethod, columnsToOrderByDefault, columnsToOrderByOrderDefault);
        }

        private IQueryable<TestDto> GetBaseQuery() {
            return _repo.GetTableData()
                .Select(u => new TestDto {
                    RowID = u.Id,
                    CanBeDeleted = u.CanBeDeleted,
                    Username = u.Username,
                    Age = u.Age,
                    EmploymentStatusName = u.EmploymentStatus != null ? u.EmploymentStatus.StatusName : null,
                    EmploymentStatusNameList = u.EmploymentStatusList,
                    Birthdate = u.Birthdate,
                    PayedTaxes = u.PayedTaxes
                });
        }
    }
}
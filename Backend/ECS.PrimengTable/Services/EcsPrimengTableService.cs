using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Interfaces;
using ECS.PrimengTable.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace ECS.PrimengTable.Services {
    public static class EcsPrimengTableService {
        #region TABLE CONFIGURATION SERVICE
        public static TableConfigurationModel GetTableConfiguration<T>(
            int[]? allowedItemsPerPage = null,
            string? dateFormat = null,
            string? dateTimezone = null,
            string? dateCulture = null,
            byte? maxViews = null,
            bool convertFieldToLower = true
        ) {
            return TableConfigurationService.GetTableConfiguration<T>(allowedItemsPerPage, dateFormat, dateTimezone, dateCulture, maxViews, convertFieldToLower);
        }
        public static bool ValidateItemsPerPageAndCols(
            byte itemsPerPage,
            List<string>? columns,
            int[]? allowedItemsPerPage = null
        ) {
            return TableConfigurationService.ValidateItemsPerPageAndCols(itemsPerPage, columns, allowedItemsPerPage);
        }
        #endregion

        public static TablePagedResponseModel PerformDynamicQuery<T>(
            TableQueryRequestModel inputData,
            IQueryable<T> baseQuery,
            MethodInfo? stringDateFormatMethod = null,
            List<string>? defaultSortColumnName = null,
            List<ColumnSort>? defaultSortOrder = null
        ) {
            return TableQueryProcessingService.PerformDynamicQuery<T>(inputData, baseQuery, stringDateFormatMethod, defaultSortColumnName, defaultSortOrder);
        }

        public static (bool, byte[]?, string) GenerateExcelReport<T>(
            ExcelExportRequestModel inputData,
            IQueryable<T> baseQuery,
            MethodInfo? stringDateFormatMethod = null,
            List<string>? defaultSortColumnName = null,
            List<ColumnSort>? defaultSortOrder = null,
            string sheetName = "MAIN",
            byte pageStack = 250
        ) {
            return ExcelExportService.GenerateExcelReport<T>(inputData, baseQuery, stringDateFormatMethod, defaultSortColumnName, defaultSortOrder, sheetName, pageStack);
        }

        public static async Task<List<ViewDataModel>> GetViewsAsync<TEntity, TUsername>(
            DbContext context,
            TUsername username,
            string tableKey
        ) where TEntity : class, ITableViewEntity<TUsername>, new() where TUsername : notnull {
            var svc = new TableViewService<TEntity, TUsername>(context);
            return await svc.GetViewsAsync(username, tableKey);
        }

        public static async Task SaveViewsAsync<TEntity, TUsername>(
            DbContext context,
            TUsername username,
            string tableKey,
            List<ViewDataModel> views
        ) where TEntity : class, ITableViewEntity<TUsername>, new() where TUsername : notnull {
            var svc = new TableViewService<TEntity, TUsername>(context);
            await svc.SaveViewsAsync(username, tableKey, views);
        }

    }
}
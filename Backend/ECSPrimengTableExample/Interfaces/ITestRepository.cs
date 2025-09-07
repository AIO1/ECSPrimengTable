using ECS.PrimengTable.Models;
using Models.PrimengTableReusableComponent;
namespace ECSPrimengTableExample.Interfaces {
    public interface ITestRepository {
        IQueryable<TestTable>GetTableData();
        IQueryable<EmploymentStatusCategory>GetEmploymentStatusCategories();
        Task<List<ViewDataModel>> GetViewsAsync(string username, ViewLoadRequestModel request);
        Task SaveViewsAsync(string username, ViewSaveRequestModel request);
    }
}
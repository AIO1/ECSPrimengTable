using Data.PrimengTableReusableComponent;
using ECS.PrimengTable.Models;
using ECS.PrimengTable.Services;
using ECSPrimengTableExample.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models.PrimengTableReusableComponent;

namespace ECSPrimengTableExample.Repository {
    public class TestRepository : ITestRepository {

        private readonly primengTableReusableComponentContext _context;

        public TestRepository(primengTableReusableComponentContext context) {
            _context = context;
        }

        public IQueryable<TestTable> GetTableData() {
            return _context.TestTables
                   .AsNoTracking()
                   .Include(t => t.EmploymentStatus);
        }

        public IQueryable<EmploymentStatusCategory> GetEmploymentStatusCategories() {
            return _context.EmploymentStatusCategories
                    .AsNoTracking()
                    .OrderBy(t => t.StatusName);
        }

        public async Task<List<ViewDataModel>> GetViewsAsync(string username, ViewLoadRequestModel request) {
            return await EcsPrimengTableService.GetViewsAsync<TableView>(
                _context,
                username,
                request.TableViewSaveKey
            );
        }

        public async Task SaveViewsAsync(string username, ViewSaveRequestModel request) {
            await EcsPrimengTableService.SaveViewsAsync<TableView>(
                _context,
                username,
                request.TableViewSaveKey,
                request.Views
            );
        }
    }
}

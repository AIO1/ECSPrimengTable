using ECS.PrimengTable.Interfaces;
using ECS.PrimengTable.Models;
using Microsoft.EntityFrameworkCore;

namespace ECS.PrimengTable.Services {

    /// <summary>
    /// Provides operations for managing table views (saving and loading)
    /// for a specific user within the given <see cref="DbContext"/>.
    /// </summary>
    /// <remarks>
    /// This class is intended for internal use only and should not be accessed directly.
    /// External consumers should use <see cref="EcsPrimengTableService"/> instead.
    /// </remarks>
    /// <typeparam name="T"> The entity type that implements <see cref="ITableViewEntity{TUsername}"/>, representing a stored view entry in the database.</typeparam>
    /// <typeparam name="TUsername"> The type representing the username or user identifier.</typeparam>
    internal class TableViewService<T, TUsername> where T : class, ITableViewEntity<TUsername>, new() where TUsername : notnull {
        private readonly DbContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="TableViewService{T, TUsername}"/> class.
        /// </summary>
        /// <param name="context">The database context used to perform operations.</param>
        internal TableViewService(DbContext context) {
            _context = context;
        }

        /// <summary>
        /// Retrieves all stored table views for the specified user and table key.
        /// </summary>
        /// <remarks>
        /// This method performs a read-only operation (<see cref="EntityFrameworkQueryableExtensions.AsNoTracking{TEntity}(IQueryable{TEntity})"/>)
        /// and returns the data ordered by the view alias.
        /// </remarks>
        /// <param name="username">The username or user identifier.</param>
        /// <param name="tableKey">The unique key identifying the table or view group.</param>
        /// <returns>
        /// A list of <see cref="ViewDataModel"/> representing the saved views for that user and table.
        /// </returns>
        internal async Task<List<ViewDataModel>> GetViewsAsync(TUsername username, string tableKey) {
            var data = await _context.Set<T>()
                .AsNoTracking()
                .Where(s => s.Username!.Equals(username) && s.TableKey == tableKey)
                .OrderBy(s => s.ViewAlias)
                .ToListAsync();
            return data.Select(s => new ViewDataModel {
                ViewAlias = s.ViewAlias,
                ViewData = s.ViewData,
                LastActive = s.LastActive
            }).ToList();
        }

        /// <summary>
        /// Saves or updates the list of table views for the given user and table key.
        /// It performs insert, update, and delete operations within a single database transaction.
        /// </summary>
        /// <param name="username">The username or user identifier.</param>
        /// <param name="tableKey">The unique key identifying the table or view group.</param>
        /// <param name="views">The list of views to save or update.</param>
        /// <remarks>
        /// The method ensures that:
        /// <list type="bullet">
        /// <item><description>Existing views are updated if they already exist by alias.</description></item>
        /// <item><description>New views are inserted if they do not exist.</description></item>
        /// <item><description>Views not present in the provided list are deleted.</description></item>
        /// </list>
        /// All operations are executed within a transaction to maintain data integrity.
        /// </remarks>
        /// <exception cref="DbUpdateException">
        /// Thrown when the database update operation fails.
        /// </exception>
        /// <exception cref="Exception">
        /// Thrown if any other unexpected error occurs during the transaction.
        /// </exception>
        internal async Task SaveViewsAsync(TUsername username, string tableKey, List<ViewDataModel> views) {
            using var transaction = await _context.Database.BeginTransactionAsync(); // Begin a new database transaction
            try {
                var existingViews = await _context.Set<T>()
                    .Where(t => t.Username!.Equals(username) && t.TableKey == tableKey)
                    .ToListAsync(); // Retrieve existing views for this user and table
                var receivedViewNames = views.Select(s => s.ViewAlias).ToList(); // Extract names from the received views
                foreach(var view in views) { // Iterate through all received views
                    var existingView = existingViews.FirstOrDefault(s => s.ViewAlias == view.ViewAlias); // Try to find an existing view with the same alias

                    if(existingView != null) { // Update existing view data
                        existingView.ViewData = view.ViewData;
                        existingView.ViewAlias = view.ViewAlias;
                        existingView.LastActive = view.LastActive;
                    } else {  // Create a new view record
                        var newView = new T {
                            Username = username,
                            TableKey = tableKey,
                            ViewAlias = view.ViewAlias,
                            ViewData = view.ViewData,
                            LastActive = view.LastActive
                        };
                        await _context.Set<T>().AddAsync(newView); // Add new view to the context
                    }
                }
                var viewsToDelete = existingViews
                    .Where(e => !receivedViewNames.Contains(e.ViewAlias))
                    .ToList();  // Determine which views should be deleted (not present in received list)
                if(viewsToDelete.Count != 0) { // If there are views that we need to delete
                    _context.Set<T>().RemoveRange(viewsToDelete); // Remove outdated views
                }
                await _context.SaveChangesAsync(); // Commit changes to the database
                await transaction.CommitAsync(); // Commit the transaction
            } catch {
                await transaction.RollbackAsync(); // Roll back the transaction on error
                throw; // Rethrow exception to be handled by the caller
            }
        }
    }
}
namespace ECS.PrimengTable.Interfaces {

    /// <summary>
    /// Represents a user-specific view of a table in ECS PrimeNG tables.
    /// Contains information about the table key, view alias, serialized view data,
    /// the username of the owner, and whether this view was the last active.
    /// </summary>
    /// <typeparam name="TUsername">The type used for the username (e.g., string, int, Guid).</typeparam>
    public interface ITableViewEntity<TUsername> {

        /// <summary>
        /// The username (or identifier) of the user who owns this table view.
        /// </summary>
        TUsername Username { get; set; }

        /// <summary>
        /// The unique key identifying the table.
        /// </summary>
        string TableKey { get; set; }

        /// <summary>
        /// The alias of the view (friendly name).
        /// </summary>
        string ViewAlias { get; set; }

        /// <summary>
        /// The serialized view data as a string.
        /// Used to store column order, visibility, filters, etc.
        /// </summary>
        string ViewData { get; set; }

        /// <summary>
        /// Value indicating whether this view was the last active one for the user.
        /// </summary>
        public bool LastActive { get; set; }
    }
}
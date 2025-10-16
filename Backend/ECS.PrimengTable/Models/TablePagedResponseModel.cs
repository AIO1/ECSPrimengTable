namespace ECS.PrimengTable.Models {

    /// <summary>
    /// Represents a paged response for a table query, including page info, total records, and the data itself.
    /// </summary>
    public class TablePagedResponseModel {

        /// <summary>
        /// The current page number of the response.
        /// </summary>
        public int Page { get; set; }

        /// <summary>
        /// Total number of records in the data set after filtering (if any).
        /// </summary>
        public long TotalRecords { get; set; }

        /// <summary>
        /// Total number of records in the data set before applying any filters.
        /// </summary>
        public long TotalRecordsNotFiltered { get; set; }

        /// <summary>
        /// The actual data returned by the query to display in the table.
        /// </summary>
        public dynamic Data { get; set; } = null!;
    }
}
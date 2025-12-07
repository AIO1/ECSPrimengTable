using ECS.PrimengTable.Enums;
namespace ECS.PrimengTable.Models {
    /// <summary>
    /// Represents the metadata of a table column.
    /// Contains information about the field, header, type, alignment, visibility, filtering, sorting,
    /// resizing, tooltip, frozen columns, overflow behavior, and initial width.
    /// </summary>
    public class ColumnMetadataModel {

        /// <summary>
        /// Field name associated with the column.
        /// </summary>
        public string Field { get; set; } = null!;

        /// <summary>
        /// Header that will be displayed for the column in the table.
        /// </summary>
        public string Header { get; set; } = null!;

        /// <summary>
        /// Data type of the column.
        /// </summary>
        public DataType DataType { get; set; }

        /// <summary>
        /// Horizontal alignment of the data in the column.
        /// </summary>
        public DataAlignHorizontal DataAlignHorizontal { get; set; }

        /// <summary>
        /// Indicates if the user can modify the horizontal alignment.
        /// </summary>
        public bool DataAlignHorizontalAllowUserEdit { get; set; }

        /// <summary>
        /// Vertical alignment of the data in the column.
        /// </summary>
        public DataAlignVertical DataAlignVertical { get; set; }

        /// <summary>
        /// Indicates if the user can modify the vertical alignment.
        /// </summary>
        public bool DataAlignVerticalAllowUserEdit { get; set; }

        /// <summary>
        /// Indicates whether the column can be hidden.
        /// </summary>
        public bool CanBeHidden { get; set; }

        /// <summary>
        /// Indicates whether the column starts hidden (if it can be hidden).
        /// </summary>
        public bool StartHidden { get; set; }

        /// <summary>
        /// Indicates whether the column can be resized by the user.
        /// </summary>
        public bool CanBeResized { get; set; }

        /// <summary>
        /// Indicates whether the column can be reordered by the user.
        /// </summary>
        public bool CanBeReordered { get; set; }

        /// <summary>
        /// Indicates whether the column can be sorted.
        /// </summary>
        public bool CanBeSorted { get; set; }

        /// <summary>
        /// Indicates whether the column can be filtered.
        /// </summary>
        public bool CanBeFiltered { get; set; }

        /// <summary>
        /// Name used in TypeScript to store predefined filter values.
        /// </summary>
        public string FilterPredefinedValuesName { get; set; } = null!;

        /// <summary>
        /// Indicates whether the column can be globally filtered. Disabled for Boolean columns.
        /// </summary>
        public bool CanBeGlobalFiltered { get; set; }

        /// <summary>
        /// Optional description displayed via an icon in the column header.
        /// </summary>
        public string ColumnDescription { get; set; } = null!;

        /// <summary>
        /// Indicates whether the data in the column should show as a tooltip on hover.
        /// </summary>
        public bool DataTooltipShow { get; set; }

        /// <summary>
        /// Optional column name to fetch custom tooltip content.
        /// </summary>
        public string DataTooltipCustomColumnSource { get; set; } = null!;

        /// <summary>
        /// Frozen column alignment (None, Left, Right).
        /// </summary>
        public FrozenColumnAlign FrozenColumnAlign { get; set; }

        /// <summary>
        /// How cell content behaves when it overflows the column.
        /// </summary>
        public CellOverflowBehaviour CellOverflowBehaviour { get; set; }

        /// <summary>
        /// Indicates whether the user can modify the overflow behavior. Disabled for Boolean columns.
        /// </summary>
        public bool CellOverflowBehaviourAllowUserEdit { get; set; }

        /// <summary>
        /// Initial width of the column in pixels. If <=0 and frozen, defaults to 100.
        /// </summary>
        public double InitialWidth { get; set; }

        /// <summary>
        /// Optional date format for this column.
        /// </summary>
        public string? DateFormat { get; set; }

        /// <summary>
        /// Optional date timezone.
        /// </summary>
        public string? DateTimezone { get; set; }

        /// <summary>
        /// Optional date culture.
        /// </summary>
        public string? DateCulture { get; set; }

        /// <summary>
        /// Optional date format for this column in exports.
        /// </summary>
        public string? ExportDateFormat { get; set; }
    }
}
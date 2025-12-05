using ECS.PrimengTable.Enums;

namespace ECS.PrimengTable.Models {

    /// <summary>
    /// Represents a set of optional overrides for column metadata.
    /// Any property defined here replaces the corresponding value on the underlying <see cref="ColumnMetadataModel"/> or <see cref="ColumnAttributes"/>.
    /// Only non-null properties are applied, allowing partial and targeted overrides.
    /// </summary>
    public class ColumnMetadataOverrideModel {

        /// <summary>
        /// Overrides the header displayed for the column.
        /// </summary>
        public string? Header { get; set; }

        /// <summary>
        /// Overrides the horizontal alignment of the column data.
        /// </summary>
        public DataAlignHorizontal? DataAlignHorizontal { get; set; }

        /// <summary>
        /// Overrides whether the user can edit the horizontal alignment.
        /// </summary>
        public bool? DataAlignHorizontalAllowUserEdit { get; set; }

        /// <summary>
        /// Overrides the vertical alignment of the column data.
        /// </summary>
        public DataAlignVertical? DataAlignVertical { get; set; }

        /// <summary>
        /// Overrides whether the user can edit the vertical alignment.
        /// </summary>
        public bool? DataAlignVerticalAllowUserEdit { get; set; }

        /// <summary>
        /// Overrides whether the column can be hidden.
        /// </summary>
        public bool? CanBeHidden { get; set; }

        /// <summary>
        /// Overrides whether the column starts hidden.
        /// </summary>
        public bool? StartHidden { get; set; }

        /// <summary>
        /// Overrides whether the column can be resized.
        /// </summary>
        public bool? CanBeResized { get; set; }

        /// <summary>
        /// Overrides whether the column can be reordered.
        /// </summary>
        public bool? CanBeReordered { get; set; }

        /// <summary>
        /// Overrides whether the column can be sorted.
        /// </summary>
        public bool? CanBeSorted { get; set; }

        /// <summary>
        /// Overrides whether the column can be filtered.
        /// </summary>
        public bool? CanBeFiltered { get; set; }

        /// <summary>
        /// Overrides whether the column can be globally filtered.
        /// </summary>
        public bool? CanBeGlobalFiltered { get; set; }

        /// <summary>
        /// Overrides the optional description displayed in the column header.
        /// </summary>
        public string? ColumnDescription { get; set; }

        /// <summary>
        /// Overrides whether the column should display its content as a tooltip on hover.
        /// </summary>
        public bool? DataTooltipShow { get; set; }

        /// <summary>
        /// Overrides how the cell behaves when content overflows the column width.
        /// </summary>
        public CellOverflowBehaviour? CellOverflowBehaviour { get; set; }

        /// <summary>
        /// Overrides whether the user can modify the overflow behavior.
        /// </summary>
        public bool? CellOverflowBehaviourAllowUserEdit { get; set; }

        /// <summary>
        /// Overrides the date formatting applied to date-like values.
        /// </summary>
        public string? DateFormat { get; set; }

        /// <summary>
        /// Overrides the timezone applied to date values for this column.
        /// </summary>
        public string? DateTimezone { get; set; }

        /// <summary>
        /// Overrides the culture applied when formatting date values.
        /// </summary>
        public string? DateCulture { get; set; }
    }
}

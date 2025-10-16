using ECS.PrimengTable.Enums;

namespace ECS.PrimengTable.Attributes {
    /// <summary>
    /// Marks a property to define its table column behavior in ECS PrimeNG tables.
    /// Includes header, data type, alignment, filtering, sorting, resizing, visibility,
    /// tooltip, and frozen column behavior.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
    public sealed class ColumnAttributes : Attribute {

        /// <summary>
        /// The name displayed for the column in the table.
        /// </summary>
        public string Header { get; }

        /// <summary>
        /// The type of data in the column, used for filtering and formatting.
        /// </summary>
        public DataType DataType { get; }

        /// <summary>
        /// Horizontal alignment of the data in the column.
        /// </summary>
        public DataAlignHorizontal DataAlignHorizontal { get; }

        /// <summary>
        /// Indicates if the user can modify the horizontal alignment.
        /// </summary>
        public bool DataAlignHorizontalAllowUserEdit { get; }

        /// <summary>
        /// Vertical alignment of the data in the column.
        /// </summary>
        public DataAlignVertical DataAlignVertical { get; }

        /// <summary>
        /// Indicates if the user can modify the vertical alignment.
        /// </summary>
        public bool DataAlignVerticalAllowUserEdit { get; }

        /// <summary>
        /// If true, the column can be hidden by the user.
        /// </summary>
        public bool CanBeHidden { get; }

        /// <summary>
        /// If true, the column starts hidden (only applies if <see cref="CanBeHidden"/> is true).
        /// </summary>
        public bool StartHidden { get; }

        /// <summary>
        /// If true, the column can be resized by the user.
        /// </summary>
        public bool CanBeResized { get; }

        /// <summary>
        /// If true, the column can be reordered by the user.
        /// </summary>
        public bool CanBeReordered { get; }

        /// <summary>
        /// If true, the column can be sorted.
        /// </summary>
        public bool CanBeSorted { get; }

        /// <summary>
        /// If true, the column can be filtered.
        /// </summary>
        public bool CanBeFiltered { get; }

        /// <summary>
        /// The name used in TypeScript to store predefined filter values.
        /// </summary>
        public string FilterPredefinedValuesName { get; }

        /// <summary>
        /// If true, data can be globally filtered. Disabled for Boolean columns.
        /// </summary>
        public bool CanBeGlobalFiltered { get; }

        /// <summary>
        /// If true, column attributes will be sent automatically in dynamic queries.
        /// </summary>
        public bool SendColumnAttributes { get; }

        /// <summary>
        /// Optional description displayed via an icon in the column header.
        /// </summary>
        public string ColumnDescription { get; }

        /// <summary>
        /// If true, displays cell content as tooltip on hover.
        /// </summary>
        public bool DataTooltipShow { get; }

        /// <summary>
        /// Optional column name to fetch custom tooltip content.
        /// </summary>
        public string DataTooltipCustomColumnSource { get; }

        /// <summary>
        /// Indicates if the column is frozen and its alignment.
        /// </summary>
        public FrozenColumnAlign FrozenColumnAlign { get; }

        /// <summary>
        /// Defines how cell content behaves when it overflows.
        /// </summary>
        public CellOverflowBehaviour CellOverflowBehaviour { get; }

        /// <summary>
        /// Indicates if the user can modify the overflow behavior.
        /// Disabled for Boolean columns.
        /// </summary>
        public bool CellOverflowBehaviourAllowUserEdit { get; }

        /// <summary>
        /// Initial width of the column in pixels.
        /// If <=0 and frozen, defaults to 100. Defaults to 0 otherwise.
        /// </summary>
        public double InitialWidth { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ColumnAttributes"/> class.
        /// </summary>
        /// <param name="header">The name displayed for the column in the table. Defaults to empty string.</param>
        /// <param name="dataType">The data type used for filtering. Defaults to <see cref="DataType.Text"/>.</param>
        /// <param name="dataAlignHorizontal">Horizontal alignment of the column. Defaults to <see cref="DataAlignHorizontal.Center"/>.</param>
        /// <param name="dataAlignHorizontalAllowUserEdit">If true, users can modify horizontal alignment. Defaults to true.</param>
        /// <param name="dataAlignVertical">Vertical alignment of the column. Defaults to <see cref="DataAlignVertical.Middle"/>.</param>
        /// <param name="dataAlignVerticalAllowUserEdit">If true, users can modify vertical alignment. Defaults to true.</param>
        /// <param name="canBeHidden">If true, the column can be hidden by the user. Defaults to true.</param>
        /// <param name="startHidden">If true, the column starts hidden (only if canBeHidden is true). Defaults to false.</param>
        /// <param name="canBeResized">If true, the column can be resized. Defaults to true.</param>
        /// <param name="canBeReordered">If true, the column can be reordered. Defaults to true.</param>
        /// <param name="canBeSorted">If true, the column can be sorted. Defaults to true.</param>
        /// <param name="canBeFiltered">If true, the column can be filtered. Defaults to true.</param>
        /// <param name="filterPredefinedValuesName">The name used in TypeScript to store predefined filter values. Defaults to empty string.</param>
        /// <param name="canBeGlobalFiltered">If true, data can be globally filtered. Disabled for Boolean columns. Defaults to true.</param>
        /// <param name="sendColumnAttributes">If true, column attributes will be sent automatically in dynamic queries. Defaults to true.</param>
        /// <param name="columnDescription">Optional description displayed via an icon in the column header. Defaults to empty string.</param>
        /// <param name="dataTooltipShow">If true, displays cell content as tooltip on hover. Defaults to true.</param>
        /// <param name="dataTooltipCustomColumnSource">Optional column name to fetch custom tooltip content. Defaults to empty string.</param>
        /// <param name="frozenColumnAlign">Indicates if the column is frozen and its alignment (<see cref="FrozenColumnAlign.None"/>, Left, Right). Defaults to None.</param>
        /// <param name="cellOverflowBehaviour">Defines how cell content behaves when it overflows. Defaults to <see cref="CellOverflowBehaviour.Hidden"/>.</param>
        /// <param name="cellOverflowBehaviourAllowUserEdit">If true, user can modify overflow behavior. Disabled for Boolean columns. Defaults to true.</param>
        /// <param name="initialWidth">Initial width of the column in pixels. If <=0 and frozen, defaults to 100. Defaults to 0.</param>
        /// <exception cref="ArgumentException">Thrown if an invalid dataAlign or dataType value is provided.</exception>
        public ColumnAttributes(
            string header = "",
            DataType dataType = DataType.Text,
            DataAlignHorizontal dataAlignHorizontal = DataAlignHorizontal.Center,
            bool dataAlignHorizontalAllowUserEdit = true,
            DataAlignVertical dataAlignVertical = DataAlignVertical.Middle,
            bool dataAlignVerticalAllowUserEdit = true,
            bool canBeHidden = true,
            bool startHidden = false,
            bool canBeResized = true,
            bool canBeReordered = true,
            bool canBeSorted = true,
            bool canBeFiltered = true,
            string filterPredefinedValuesName = "",
            bool canBeGlobalFiltered = true,
            bool sendColumnAttributes = true,
            string columnDescription = "",
            bool dataTooltipShow = true,
            string dataTooltipCustomColumnSource = "",
            FrozenColumnAlign frozenColumnAlign = FrozenColumnAlign.None,
            CellOverflowBehaviour cellOverflowBehaviour = CellOverflowBehaviour.Hidden,
            bool cellOverflowBehaviourAllowUserEdit = true,
            double initialWidth = 0
        ) {
            Header = header;
            DataType = dataType;
            DataAlignHorizontal = dataAlignHorizontal;
            DataAlignHorizontalAllowUserEdit = dataAlignHorizontalAllowUserEdit;
            DataAlignVertical = dataAlignVertical;
            DataAlignVerticalAllowUserEdit = dataAlignVerticalAllowUserEdit;
            CanBeHidden = canBeHidden;
            StartHidden = startHidden && canBeHidden;
            CanBeResized = frozenColumnAlign == FrozenColumnAlign.None && canBeResized;
            CanBeReordered = canBeReordered && frozenColumnAlign == FrozenColumnAlign.None;
            CanBeSorted = canBeSorted;
            CanBeFiltered = canBeFiltered;
            FilterPredefinedValuesName = filterPredefinedValuesName;
            CanBeGlobalFiltered = canBeGlobalFiltered && canBeFiltered && dataType != DataType.Boolean;
            SendColumnAttributes = sendColumnAttributes;
            ColumnDescription = columnDescription;
            DataTooltipShow = dataTooltipShow;
            DataTooltipCustomColumnSource = dataTooltipCustomColumnSource;
            FrozenColumnAlign = frozenColumnAlign;
            CellOverflowBehaviour = dataType == DataType.Boolean ? CellOverflowBehaviour.Hidden : cellOverflowBehaviour;
            CellOverflowBehaviourAllowUserEdit = cellOverflowBehaviourAllowUserEdit && dataType != DataType.Boolean;
            InitialWidth = initialWidth <= 0 && frozenColumnAlign != FrozenColumnAlign.None ? 100 : initialWidth;
        }
    }
}
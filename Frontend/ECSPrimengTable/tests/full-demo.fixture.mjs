// Browser preview data for the existing people demo. The application still uses its original API.
export function fullDemoFixture(DataType) {
  const columnsInfo = [
    { field: 'username', header: 'Username', canBeHidden: false, frozenColumnAlign: 1, initialWidth: 240 },
    { field: 'age', header: 'Age', dataType: DataType.Numeric },
    { field: 'employmentStatusName', header: 'Employment status', filterPredefinedValuesName: 'employmentStatusPredefinedFilter', dataTooltipCustomColumnSource: 'esL_tooltip' },
    { field: 'employmentStatusNameList', header: 'Employment status list', dataType: DataType.List, filterPredefinedValuesName: 'employmentStatusPredefinedFilterList', dataTooltipCustomColumnSource: 'esList_tooltip', initialWidth: 280 },
    { field: 'birthdate', header: 'Birthdate', dataType: DataType.Date, startHidden: true },
    { field: 'payedTaxes', header: 'Payed taxes?', dataType: DataType.Boolean, startHidden: true }
  ].map(c => ({ dataType: DataType.Text, dataAlignHorizontal: 0, dataAlignVertical: 1,
    frozenColumnAlign: 0, cellOverflowBehaviour: 0, cellOverflowBehaviourAllowUserEdit: true,
    dataAlignHorizontalAllowUserEdit: true, dataAlignVerticalAllowUserEdit: true,
    canBeSorted: true, canBeFiltered: true, canBeGlobalFiltered: true, canBeHidden: true,
    canBeResized: true, canBeReordered: true, dataTooltipShow: true, initialWidth: 180, ...c }));
  const names = ['Ana', 'Bruno', 'Carla', 'David', 'Elena', 'Francisco', 'Gabriela', 'Hugo', 'Inés', 'Javier', 'Laura', 'Marcos'];
  const statuses = ['Full-time', 'Freelance', 'Unemployed', 'Student'];
  const data = names.map((username, i) => ({ rowID: `person-${i + 1}`, username, age: 22 + i * 3,
    employmentStatusName: statuses[i % statuses.length],
    employmentStatusNameList: i % 2 === 0 ? `${statuses[i % statuses.length]};Student` : statuses[i % statuses.length],
    birthdate: `${1980 + i}-05-15T00:00:00Z`, payedTaxes: i % 2 === 0, canBeDeleted: i % 3 !== 0,
    esL_tooltip: `Situación de ${username}`,
    esList_tooltip: `Situación principal de ${username};Formación de ${username}` }));
  return { columnsInfo, data, statuses: statuses.map((statusName, i) => ({ statusName, colorR: [30, 40, 200, 120][i], colorG: [130, 110, 70, 70][i], colorB: [70, 210, 50, 190][i] })) };
}

export function queryFixture(rows, request = {}, listFields = []) {
  const field = name => name ? name[0].toLowerCase() + name.slice(1) : name;
  const lists = new Set(listFields.map(field));
  const match = (value, filter, isList) => {
    const expected = filter.value;
    if (expected === null || expected === undefined || expected === '') return true;
    const text = String(value ?? '').toLowerCase(), search = String(expected).toLowerCase();
    switch (filter.matchMode) {
      case 'equals': return value == expected;
      case 'notEquals': return value != expected;
      case 'gt': return value != null && value > expected;
      case 'gte': return value != null && value >= expected;
      case 'lt': return value != null && value < expected;
      case 'lte': return value != null && value <= expected;
      case 'startsWith': return text.startsWith(search);
      case 'endsWith': return text.endsWith(search);
      case 'notContains': return !text.includes(search);
      case 'in': {
        if (!Array.isArray(expected)) return false;
        if (expected.length === 0) return true;
        if (!isList) return expected.includes(value);
        const items = typeof value === 'string' ? value.split(';').map(item => item.trim().toLowerCase()).filter(Boolean) : [];
        return expected.some(selected => items.includes(String(selected).trim().toLowerCase()));
      }
      default: return text.includes(search);
    }
  };
  let data = rows.filter(row => (!request.globalFilter || Object.values(row).some(value => String(value ?? '').toLowerCase().includes(request.globalFilter.toLowerCase()))) &&
    Object.entries(request.filter || {}).every(([key, filters]) => {
      const active = filters.filter(f => f.value !== null && f.value !== undefined && f.value !== '');
      return active.length === 0 || (active[0].operator?.toLowerCase() === 'or'
        ? active.some(f => match(row[field(key)], f, lists.has(field(key))))
        : active.every(f => match(row[field(key)], f, lists.has(field(key)))));
    }));
  const totalRecords = data.length;
  data = [...data].sort((a, b) => {
    for (const sort of request.sort || []) {
      const left = a[field(sort.field)], right = b[field(sort.field)];
      const order = left == right ? 0 : left == null ? -1 : right == null ? 1 : left < right ? -1 : 1;
      if (order) return order * sort.order;
    }
    return 0;
  });
  const size = request.pageSize || 10, page = Math.max(0, Math.min(request.page || 0, Math.ceil(totalRecords / size) - 1));
  return { page, totalRecords, totalRecordsNotFiltered: rows.length, data: data.slice(page * size, (page + 1) * size) };
}

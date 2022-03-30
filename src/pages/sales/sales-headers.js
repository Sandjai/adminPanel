const header = [
  {
    id: 'id',
    title: 'ID',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'user',
    title: 'Client',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'createdAt',
    title: 'Date',
    sortable: true,
    sortType: 'number',
    template: data => {
      const date = new Date(data);
      let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return `<div class="sortable-table__cell"> ${date.toLocaleDateString('en', options)}</div>`;
    }
  },
  {
    id: 'totalCost',
    title: 'Cost',
    sortable: true,
    sortType: 'number',
    template: data => '<div class="sortable-table__cell">$' + data + '</div>'
  },
  {
    id: 'delivery',
    title: 'Status',
    sortable: true,
    sortType: 'string'
  }
];
  
export default header;
  
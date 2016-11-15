import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter } from 'material-ui/Table';
import SmartTableRow  from '../SmartTableRow/SmartTableRow';
import TableSpinner  from '../TableSpinner/TableSpinner';
import React, { PropTypes, Component } from 'react';
import SortIcon from 'material-ui/svg-icons/action/swap-vert';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import injectTapEventPlugin from 'react-tap-event-plugin';
import createFragment from 'react-addons-create-fragment'
import {red500, yellow500, blue500} from 'material-ui/styles/colors';
import styles from './SmartTable.scss';
import formatTableCell from '../SmartTableRow/formatTableCell';


injectTapEventPlugin();


function sortFunc(a, b, key) {


  if (typeof (a.node[key]) === 'number') {
    return a.node[key] - b.node[key];
  }


  const ax = [];
  const bx = [];

  if (a.node[key] === undefined)
    return 0;


  (a.node[key]).replace(/(\d+)|(\D+)/g, (_, $1, $2) => { ax.push([$1 || Infinity, $2 || '']); });
  (b.node[key]).replace(/(\d+)|(\D+)/g, (_, $1, $2) => { bx.push([$1 || Infinity, $2 || '']); });

  while (ax.length && bx.length) {
    const an = ax.shift();
    const bn = bx.shift();
    const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
    if (nn) return nn;
  }

  return ax.length - bx.length;
}

//converts object  { a: 55, b: 55, c: { d: 55 } } to { a: 55, b: 55, d: 55 }
export function processTableData(data) {

  if (data.constructor === Array) {
    return data.map(obj => {
      const newObj = {};

      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object') {
          Object.keys(obj[key]).forEach(subKey => {
            newObj[subKey] = obj[key][subKey];
          });
        } else {
          newObj[key] = obj[key];
        }
      });

      return newObj;
    });
  }
  return [];
}

class SmartTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAsc: true,
      sortHeader: null,
      offset: 0,
      limit: props.limit,
      page: [],
      relay: props.relay,
    };
  }

  componentWillMount() {
    this.setState({
      data: this.props.data.edges,
      page: this.props.data.edges,
      relay: this.props.relay,
      currentPage: 1
    });
  }

  componentWillReceiveProps(nextProps) {

    this.setState({
      offset: 0,
      sortHeader: null,
      data: nextProps.data.edges,
      page: nextProps.data.edges
    });
  }

  sortByColumn(sortHeader, data, limit) {
    const isAsc = this.state.sortHeader === sortHeader ? !this.state.isAsc : true;
    const sortedData = data.sort((a, b) => sortFunc(a, b, sortHeader));

    if (!isAsc) {
      sortedData.reverse();
    }

    this.setState({
      page: sortedData.slice(0, limit),
      data: sortedData,
      sortHeader,
      offset: 0,
      isAsc
    });
  }

  paginate(offset, limit) {
    this.setState({
      page: this.state.data.slice(offset, offset + limit),
      offset,
    });
  }

  paginateRelay(edges) {
      this.state.relay.setVariables({ cursor :  edges[edges.length - 1].cursor, pageSize: 3 });
  }

  render() {

    const {   tableHeaders, isLoading } = this.props;
    const { offset, limit, page } = this.state;

    let total = 100;
    const processedData = processTableData(page);


    return (
      <Table className={ styles.table } selectable={ true }>
        <TableHeader displaySelectAll={ false } adjustForCheckbox={ true }>
        <TableRow>
               <TableHeaderColumn colSpan="{tableHeaders.length}"  style={{textAlign: 'center'}}>
                 Sections
               </TableHeaderColumn>
             </TableRow>

          <TableRow>
            { !!tableHeaders && tableHeaders.map((header, index) => (
              <TableHeaderColumn key={ index }>
                <div className={ styles.rowAlign }>
                  { header.alias }
                  { header.sortable &&
                    <SortIcon id={ header.dataAlias }  onMouseUp={ (e) => this.sortByColumn(e.target.id, this.state.data, limit) }  />
                  }
                </div>
              </TableHeaderColumn>
            )) }
          </TableRow>
        </TableHeader>

        <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={true} preScanRows={true}>
          {
            (isLoading && <TableSpinner />) ||
            (processedData.map(( row, index ) => (
              <TableRow key={index} selected={row.selected}>
                  <TableRowColumn>{row.id}</TableRowColumn>
                  <TableRowColumn>{row.name}</TableRowColumn>
                  <TableRowColumn> {row.name}</TableRowColumn>
              </TableRow>
            )))
          }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableRowColumn>
              <div className={ styles.footerControls }>
                { `${Math.min((offset + 1), total)} - ${Math.min((offset + limit), total)} of ${this.props.data.edges[0].node.totalCount}` }
                {/*<IconButton disabled={!this.props.data.pageInfo.hasPreviousPage} onClick={ () => this.paginateRelay(this.props.data.edges) }>
                  <ChevronLeft />
                </IconButton>*/}
                <IconButton disabled={!this.props.data.pageInfo.hasNextPage} onClick={ () => this.paginateRelay(this.props.data.edges) }>
                  <ChevronRight />
                </IconButton>
              </div>
            </TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
}

SmartTable.propTypes = {
  tableHeaders: PropTypes.array,
  data: PropTypes.object,
  offset: PropTypes.number, // current offset
  total: PropTypes.number, // total number of rows
  limit: PropTypes.number, // num of rows in each page,
  isLoading: PropTypes.bool,
};

export default SmartTable;

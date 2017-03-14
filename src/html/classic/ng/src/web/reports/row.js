/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React from 'react';

import _, {datetime} from '../../locale.js';

import Layout from '../layout.js';
import LegacyLink from '../legacylink.js';
import PropTypes from '../proptypes.js';
import SeverityBar from '../severitybar.js';
import StatusBar from '../statusbar.js';
import {render_component} from '../render.js';

import {withEntityActions} from '../entities/actions.js';
import {withEntityRow} from '../entities/row.js';

import DeleteIcon from '../icons/deleteicon.js';

import TableData from '../table/data.js';
import TableRow from '../table/row.js';

const IconActions = ({entity, onEntityDelete}) => {
  let {report} = entity;
  let active = report.scan_run_status !== 'Running' &&
    report.scan_run_status !== 'Requested' &&
    report.scan_run_status !== 'Stop Requested' &&
    report.scan_run_status !== 'Resume Requested';

  let title;
  if (active) {
    title = _('Delete Report');
  }
  else {
    title = _('Scan is active');
  }
  return (
    <Layout flex align={['center', 'center']}>
      <DeleteIcon
        active={active}
        value={entity}
        title={title}
        onClick={onEntityDelete}/>
    </Layout>
  );
};

IconActions.propTypes = {
  entity: React.PropTypes.object.isRequired,
  onEntityDelete: React.PropTypes.func,
};

const Row = props => {
  let {entity, links = true, actions, ...other} = props;
  let {report} = entity;
  let status;

  if (report.task && report.task.target && report.task.target.id === '' &&
      report.scan_run_status === 'Running') {
    status = 'Uploading';
  }
  else if (report.task && report.task.target && report.task.target.id === '') {
    status = 'Container';
  }
  else {
    status = report.scan_run_status;
  }

  return (
    <TableRow>
      <TableData>
        {links ?
          <LegacyLink cmd="get_report" report_id={entity.id}>
            {datetime(report.timestamp)}
          </LegacyLink> :
            datetime(report.timestamp)
        }
      </TableData>
      <TableData>
        <StatusBar
          status={status}
          progress={report.task.progress}/>
      </TableData>
      <TableData>
        {links ?
          <LegacyLink cmd="get_task" task_id={entity.task.id}>
            {entity.task.name}
          </LegacyLink> :
            entity.task.name
        }
      </TableData>
      <TableData flex align="center">
        <SeverityBar severity={entity.report.severity.filtered}/>
      </TableData>
      <TableData flex align="end">
        {report.result_count.hole.filtered}
      </TableData>
      <TableData flex align="end">
        {report.result_count.warning.filtered}
      </TableData>
      <TableData flex align="end">
        {report.result_count.info.filtered}
      </TableData>
      <TableData flex align="end">
        {report.result_count.log.filtered}
      </TableData>
      <TableData flex align="end">
        {report.result_count.false_positive.filtered}
      </TableData>
      {render_component(actions, {...other, entity})}
    </TableRow>
  );
};


Row.propTypes = {
  actions: PropTypes.componentOrFalse,
  entity: React.PropTypes.object,
  links: React.PropTypes.bool,
};

export default withEntityRow(Row, withEntityActions(IconActions));

// vim: set ts=2 sw=2 tw=80:

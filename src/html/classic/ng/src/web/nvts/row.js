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

import {datetime} from '../../locale.js';

import CveId from '../cveid.js';
import LegacyLink from '../legacylink.js';
import PropTypes from '../proptypes.js';
import SeverityBar from '../severitybar.js';
import SolutionType from '../solutiontype.js';
import {render_component} from '../render.js';

import {withEntityRow} from '../entities/row.js';

import TableRow from '../table/row.js';
import TableData from '../table/data.js';

const Row = ({entity, links = true, actions, ...other}) => {
  return (
    <TableRow>
      <TableData>
        {links ?
          <LegacyLink
            cmd="get_info"
            details="1"
            info_type="nvt"
            info_id={entity.id}>
            {entity.name}
          </LegacyLink> :
            entity.name
        }
      </TableData>
      <TableData>
        {links ?
          <LegacyLink
            cmd="get_info"
            info_type="nvt"
            filter={'family="' + entity.family + '"'}>
            {entity.family}
          </LegacyLink> :
          entity.family
        }
      </TableData>
      <TableData>
        {datetime(entity.creation_time)}
      </TableData>
      <TableData>
        {datetime(entity.modification_time)}
      </TableData>
      <TableData flex align="center">
        {entity.version}
      </TableData>
      <TableData>
        {entity.cve_ids.map(id =>
          <CveId
            key={id}
            id={id}
            link={links}/>
        )}
      </TableData>
      <TableData flex align="center">
        {entity && entity.tags &&
          <SolutionType type={entity.tags.solution_type}/>
        }
      </TableData>
      <TableData flex align="center">
        <SeverityBar severity={entity.cvss_base}/>
      </TableData>
      <TableData flex align="center">
        {entity.qod && entity.qod.value} %
      </TableData>
      {render_component(actions, {...other, entity})}
    </TableRow>
  );
};

Row.propTypes = {
  actions: PropTypes.componentOrFalse,
  entity: PropTypes.model,
  links: PropTypes.bool,
};

export default withEntityRow(Row);

// vim: set ts=2 sw=2 tw=80:
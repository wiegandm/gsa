/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2018 Greenbone Networks GmbH
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

import {scaleOrdinal} from 'd3-scale';

import {interpolateHcl} from 'd3-interpolate';

import _ from 'gmp/locale';

import {is_defined} from 'gmp/utils/identity';
import {map} from 'gmp/utils/array';

import DonutChart from '../../../components/chart/donut3d';

import DataDisplay from '../../../components/dashboard2/data/display';
import {
  EMPTY,
  totalCount,
  percent,
} from '../../../components/dashboard2/data/utils';

import {TASKS_STATUS} from './loaders';

const red = interpolateHcl('#d62728', '#ff9896');
const green = interpolateHcl('#2ca02c', '#98df8a');
const blue = interpolateHcl('#aec7e8', '#1f77b4');
const orange = interpolateHcl('#ff7f0e', '#ffbb78');

const taskStatusColorScale = scaleOrdinal()
  .domain([
    'Delete Requested',
    'Ultimate Delete Requested',
    'Internal Error',
    'New',
    'Requested',
    'Running',
    'Stop Requested',
    'Stopped',
    'Done',
    'N/A',
  ])
  .range([
    red(1.0),
    red(0.5),
    red(0.0),
    green(1.0),
    green(0.5),
    green(0.0),
    orange(1.0),
    orange(0.0),
    blue(0.5),
    'silver',
  ]);

const transformStatusData = (data = {}) => {
  const {group: groups} = data;

  if (!is_defined(groups)) {
    return EMPTY;
  };

  const sum = totalCount(groups);

  const tdata = map(groups, group => {
    const {count, value} = group;
    const perc = percent(count, sum);
    return {
      value: count,
      label: value,
      toolTip: `${value}: ${perc}% (${count})`,
      color: taskStatusColorScale(value),
    };
  });

  tdata.total = sum;

  return tdata;
};

const TasksStatusDisplay = props => (
  <DataDisplay
    {...props}
    dataTransform={transformStatusData}
    dataId={TASKS_STATUS}
    title={({data}) =>
      _('Tasks by Status (Total: {{count}})', {count: data.total})}
  >
    {({width, height, data}) => (
      <DonutChart
        width={width}
        height={height}
        data={data}
      />
    )}
  </DataDisplay>
);

export default TasksStatusDisplay;

// vim: set ts=2 sw=2 tw=80:

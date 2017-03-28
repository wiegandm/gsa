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

import _ from '../../locale.js';
import logger from '../../log.js';
import {is_defined, shorten} from '../../utils.js';

import Layout from '../layout.js';
import PropTypes from '../proptypes.js';

import EntitiesPage from '../entities/page.js';
import {withEntitiesContainer} from '../entities/container.js';

import HelpIcon from '../icons/helpicon.js';
import NewIcon from '../icons/newicon.js';

import {createFilterDialog} from '../powerfilter/dialog.js';

import AgentDialog from './dialog.js';
import Table from './table.js';

const log = logger.getLogger('web.agents.agentspage');

const SORT_FIELDS = [
  ['name', _('Name')],
  ['trust', _('Trust')],
];

const ToolBarIcons = ({
    onNewAgentClick
  }, {capabilities}) => {
  return (
    <Layout flex>
      <HelpIcon
        page="agents"
        title={_('Help: Agents')}/>
      {capabilities.mayCreate('agent') &&
        <NewIcon
          title={_('New Agent')}
          onClick={onNewAgentClick}/>
      }
    </Layout>
  );
};

ToolBarIcons.propTypes = {
  onNewAgentClick: React.PropTypes.func,
};

ToolBarIcons.contextTypes = {
  capabilities: PropTypes.capabilities.isRequired,
};

class Page extends React.Component {

  constructor(...args) {
    super(...args);

    this.handleSaveAgent = this.handleSaveAgent.bind(this);
    this.handleVerifyAgent = this.handleVerifyAgent.bind(this);
    this.openAgentDialog = this.openAgentDialog.bind(this);
  }

  handleSaveAgent(data) {
    const {onChanged, entityCommand} = this.props;
    let promise;

    if (is_defined(data.agent)) {
      promise = entityCommand.save(data);
    }
    else {
      promise = entityCommand.create(data);
    }

    return promise.then(() => onChanged());
  }

  handleVerifyAgent(agent) {
    const {entityCommand, showSuccess, showError} = this.props;

    entityCommand.verify(agent).then(response => {
      showSuccess(_('Verifying the agent was successful.'));
      log.debug('verify success', response.data);
    }, rejection => {
      showError(_('Verifying the agent bbb failed.'));
      log.debug('verify failure', rejection);
    });
  }

  openAgentDialog(agent) {
    if (is_defined(agent)) {
      this.agent_dialog.show({
        id: agent.id,
        agent,
        name: agent.name,
        comment: agent.comment,
      }, {
        title: _('Edit agent {{name}}', {name: shorten(agent.name)}),
      });
    }
    else {
      this.agent_dialog.show({});
    }
  }

  render() {
    return (
      <Layout>
        <EntitiesPage
          {...this.props}
          onEntityEdit={this.openAgentDialog}
          onVerifyAgent={this.handleVerifyAgent}
          onNewAgentClick={this.openAgentDialog}
        />
        <AgentDialog
          ref={ref => this.agent_dialog = ref}
          onSave={this.handleSaveAgent}
        />
      </Layout>
    );
  }
}

Page.propTypes = {
  entityCommand: PropTypes.entitycommand,
  onChanged: React.PropTypes.func,
  showError: React.PropTypes.func.isRequired,
  showSuccess: React.PropTypes.func.isRequired,
};

export default withEntitiesContainer(Page, 'agent', {
  filterEditDialog: createFilterDialog({
    sortFields: SORT_FIELDS,
  }),
  sectionIcon: 'agent.svg',
  table: Table,
  title: _('Agents'),
  toolBarIcons: ToolBarIcons,
});

// vim: set ts=2 sw=2 tw=80:
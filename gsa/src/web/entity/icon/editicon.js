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

import _ from 'gmp/locale';
import {is_defined} from 'gmp/utils/identity';
import {getEntityType, typeName} from 'gmp/utils/entitytype';

import PropTypes from 'web/utils/proptypes';
import withCapabilities from 'web/utils/withCapabilities';

import EditIcon from 'web/components/icon/editicon';

const EntityEditIcon = ({
  capabilities,
  displayName,
  entity,
  name,
  title,
  onClick,
  ...props
}) => {
  const {permissions} = entity;

  if (!is_defined(name)) {
    name = getEntityType(entity);
  }

  if (!is_defined(displayName)) {
    displayName = typeName(name);
  }

  const may_edit = capabilities.mayEdit(name) && (!is_defined(permissions) ||
    permissions.mayEdit(name));
  const active = may_edit && entity.isWritable();

  if (!is_defined(title)) {
    if (active) {
      title = _('Edit {{entity}}', {entity: displayName});
    }
    else if (!entity.isWritable()) {
      title = _('{{entity}} is not writable', {entity: displayName});
    }
    else if (!may_edit) {  // eslint-disable-line no-negated-condition
      title = _('Permission to edit {{entity}} denied', {entity: displayName});
    }
    else {
      title = _('Cannot modify {{entity}}', {entity: displayName});
    }
  }
  return (
    <EditIcon
      {...props}
      title={title}
      value={entity}
      active={active}
      onClick={active ? onClick : undefined}
    />
  );
};

EntityEditIcon.propTypes = {
  capabilities: PropTypes.capabilities.isRequired,
  displayName: PropTypes.string,
  entity: PropTypes.model.isRequired,
  name: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

export default withCapabilities(EntityEditIcon);

// vim: set ts=2 sw=2 tw=80:
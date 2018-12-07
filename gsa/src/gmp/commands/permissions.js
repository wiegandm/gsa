/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 - 2018 Greenbone Networks GmbH
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
import logger from '../log.js';

import registerCommand from '../command';

import Permission from '../models/permission';

import {apiType} from '../utils/entitytype';

import EntitiesCommand from './entities';
import EntityCommand from './entity';

const log = logger.getLogger('gmp.commands.permissions');

class PermissionCommand extends EntityCommand {

  constructor(http) {
    super(http, 'permission', Permission);
  }

  getElementFromRoot(root) {
    return root.get_permission.get_permissions_response.permission;
  }

  create({
    name,
    comment = '',
    groupId,
    roleId,
    userId,
    resourceId,
    resourceType,
    subjectType,
  }) {
    const data = {
      cmd: 'create_permission',
      comment,
      permission: name,
      permission_group_id: groupId,
      permission_role_id: roleId,
      permission_user_id: userId,
      optional_resource_type: apiType(resourceType),
      id_or_empty: resourceId,
      subject_type: apiType(subjectType),
    };
    log.debug('Creating new permission', data);
    return this.action(data);
  }

  save({
    id,
    name,
    comment = '',
    groupId,
    roleId,
    userId,
    resourceId,
    resourceType,
    subjectType,
  }) {
    const data = {
      cmd: 'save_permission',
      id,
      comment,
      permission: name,
      group_id: groupId,
      role_id: roleId,
      user_id: userId,
      resource_id: resourceId,
      optional_resource_type: apiType(resourceType),
      subject_type: subjectType,
      id_or_empty: resourceId,
    };
    log.debug('Saving permission', data);
    return this.action(data);
  }
}

class PermissionsCommand extends EntitiesCommand {

  constructor(http) {
    super(http, 'permission', Permission);
  }

  create({
    id,
    permission,
    entityType,
    comment = '',
    groupId,
    roleId,
    userId,
    subjectType,
    includeRelated,
    related = [],
  }) {
    const data = {
      cmd: 'create_permissions',
      comment,
      permission,
      permission_group_id: groupId,
      permission_role_id: roleId,
      permission_user_id: userId,
      resource_id: id,
      resource_type: apiType(entityType),
      include_related: includeRelated,
      subject_type: subjectType,
    };

    for (const resource in related) {
      data['related:' + resource.id] = resource.name;
    }

    log.debug('Creating new permission', data);
    return this.httpPost(data);
  }

  getEntitiesResponse(root) {
    return root.get_permissions.get_permissions_response;
  }
}

registerCommand('permission', PermissionCommand);
registerCommand('permissions', PermissionsCommand);

// vim: set ts=2 sw=2 tw=80:
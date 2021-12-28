/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { FC, useMemo } from 'react';
import { styled, t } from '@superset-ui/core';
import { Tooltip } from 'src/components/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import EditableTitle from 'src/components/EditableTitle';
import SwiggySliceHeaderControls, {
  SliceHeaderControlsProps,
} from 'src/swiggy-dashboard/components/SliceHeaderControls';
import FiltersBadge from 'src/dashboard/components/FiltersBadge';
import Icons from 'src/components/Icons';
import { RootState } from 'src/dashboard/types';
import FilterIndicator from 'src/dashboard/components/FiltersBadge/FilterIndicator';
import { clearDataMask } from 'src/dataMask/actions';

// ADDITION
import moment from 'moment';
// eslint-disable-next-line no-restricted-imports
import { Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
// ADDITION-END

// ADDITION
const RefreshContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RefreshTooltip = styled.div`
  height: auto;
  margin: ${({ theme }) => theme.gridUnit}px 6px;
  color: ${({ theme }) => theme.colors.grayscale.base};
  line-height: ${({ theme }) => theme.typography.sizes.m}px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 0.85rem;
  justify-content: flex-start;
`;
// ADDITION-END

type SliceHeaderProps = SliceHeaderControlsProps & {
  innerRef?: string;
  updateSliceName?: (arg0: string) => void;
  editMode?: boolean;
  annotationQuery?: object;
  annotationError?: object;
  sliceName?: string;
  filters: object;
  handleToggleFullSize: () => void;
  formData: object;
  // ADDITION
  showTimestamp?: boolean;
  isIndianTZ?: boolean;
  // ADDITION-END
};

const annotationsLoading = t('Annotation layers are still loading.');
const annotationsError = t('One ore more annotation layers failed loading.');

const CrossFilterIcon = styled(Icons.CursorTarget)`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary.base};
  height: 22px;
  width: 22px;
`;

const SwiggySliceHeader: FC<SliceHeaderProps> = ({
  innerRef = null,
  forceRefresh = () => ({}),
  updateSliceName = () => ({}),
  toggleExpandSlice = () => ({}),
  logExploreChart = () => ({}),
  exploreUrl = '#',
  exportCSV = () => ({}),
  editMode = false,
  annotationQuery = {},
  annotationError = {},
  cachedDttm = null,
  updatedDttm = null,
  isCached = [],
  isExpanded = false,
  sliceName = '',
  supersetCanExplore = false,
  supersetCanShare = false,
  supersetCanCSV = false,
  sliceCanEdit = false,
  exportFullCSV,
  slice,
  componentId,
  dashboardId,
  addSuccessToast,
  addDangerToast,
  handleToggleFullSize,
  isFullSize,
  chartStatus,
  formData,
  // ADDITION
  showTimestamp = true,
  isIndianTZ = true,
  // ADDITION-END
}) => {
  const dispatch = useDispatch();
  // TODO: change to indicator field after it will be implemented
  const crossFilterValue = useSelector<RootState, any>(
    state => state.dataMask[slice?.slice_id]?.filterState?.value,
  );

  const indicator = useMemo(
    () => ({
      value: crossFilterValue,
      name: t('Emitted values'),
    }),
    [crossFilterValue],
  );

  // ADDITION
  const refreshChart = () => {
    if (updatedDttm) {
      forceRefresh(slice.slice_id, dashboardId);
    }
  };

  const cachedWhen = (cachedDttm || []).map(itemCachedDttm => {
    if (isIndianTZ) {
      return moment
        .tz(itemCachedDttm, 'Asia/Calcutta')
        .format('hh:mm A')
        .toString();
    }
    return moment.utc(itemCachedDttm).fromNow();
  });

  let updatedWhen = '';
  if (isIndianTZ) {
    updatedWhen = updatedDttm
      ? moment.tz(updatedDttm, 'Asia/Calcutta').format('hh:mm A').toString()
      : '';
  } else {
    updatedWhen = updatedDttm ? moment.utc(updatedDttm).fromNow() : '';
  }
  const getCachedTitle = (itemCached: boolean) => {
    if (itemCached) {
      return t(cachedWhen.join('. '));
    }
    if (updatedWhen) {
      return t(updatedWhen);
    }
    return '';
  };
  const refreshTooltipData = [...new Set(isCached.map(getCachedTitle) || '')];
  // If all queries have same cache time we can unit them to one
  const refreshTooltip = refreshTooltipData.map((item, index) => (
    <div key={`tooltip-${index}`} style={{ textAlign: 'center' }}>
      {refreshTooltipData.length > 1
        ? t('Query %s: %s', index + 1, item)
        : item}
    </div>
  ));
  // ADDITION-END

  return (
    <div className="chart-header" data-test="slice-header" ref={innerRef}>
      <div className="header-title">
        <EditableTitle
          title={
            sliceName ||
            (editMode
              ? '---' // this makes an empty title clickable
              : '')
          }
          canEdit={editMode}
          emptyText=""
          onSaveTitle={updateSliceName}
          showTooltip={false}
        />
        {!!Object.values(annotationQuery).length && (
          <Tooltip
            id="annotations-loading-tooltip"
            placement="top"
            title={annotationsLoading}
          >
            <i
              role="img"
              aria-label={annotationsLoading}
              className="fa fa-refresh warning"
            />
          </Tooltip>
        )}
        {!!Object.values(annotationError).length && (
          <Tooltip
            id="annoation-errors-tooltip"
            placement="top"
            title={annotationsError}
          >
            <i
              role="img"
              aria-label={annotationsError}
              className="fa fa-exclamation-circle danger"
            />
          </Tooltip>
        )}
      </div>
      {/* ADDITION */}
      {showTimestamp && updatedDttm && (
        <RefreshContainer>
          <RefreshTooltip>{refreshTooltip}</RefreshTooltip>
          <Button
            shape="round"
            size="small"
            icon={<SyncOutlined />}
            onClick={refreshChart}
          />
        </RefreshContainer>
      )}
      {/* ADDITION-END */}
      <div className="header-controls">
        {!editMode && (
          <>
            {crossFilterValue && (
              <Tooltip
                placement="top"
                title={
                  <FilterIndicator
                    indicator={indicator}
                    text={t('Click to clear emitted filters')}
                  />
                }
              >
                <CrossFilterIcon
                  onClick={() => dispatch(clearDataMask(slice?.slice_id))}
                />
              </Tooltip>
            )}
            <FiltersBadge chartId={slice.slice_id} />
            {/* UPDATE: name */}
            <SwiggySliceHeaderControls
              slice={slice}
              isCached={isCached}
              isExpanded={isExpanded}
              cachedDttm={cachedDttm}
              updatedDttm={updatedDttm}
              toggleExpandSlice={toggleExpandSlice}
              forceRefresh={forceRefresh}
              logExploreChart={logExploreChart}
              exploreUrl={exploreUrl}
              exportCSV={exportCSV}
              exportFullCSV={exportFullCSV}
              supersetCanExplore={supersetCanExplore}
              supersetCanShare={supersetCanShare}
              supersetCanCSV={supersetCanCSV}
              sliceCanEdit={sliceCanEdit}
              componentId={componentId}
              dashboardId={dashboardId}
              addSuccessToast={addSuccessToast}
              addDangerToast={addDangerToast}
              handleToggleFullSize={handleToggleFullSize}
              isFullSize={isFullSize}
              chartStatus={chartStatus}
              formData={formData}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SwiggySliceHeader;

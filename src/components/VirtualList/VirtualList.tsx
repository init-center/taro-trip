import { BaseEventOrigFunction, ScrollView, ScrollViewProps, View } from "@tarojs/components";
import {
  createSelectorQuery,
  nextTick,
  createIntersectionObserver,
  getCurrentInstance,
  getSystemInfoSync,
} from "@tarojs/taro";
import { useCallback, useEffect, useRef, useState } from "react";

export interface VirtualListProps<T> {
  id?: string;
  list: T[];
  className?: string;
  visibleCount?: number;
  scrollViewProps?: ScrollViewProps;
  overScanGroup?: number;
  children: (props: { item: T; index: number }) => React.ReactNode;
}

export function VirtualList<T extends Record<string, any>>(props: VirtualListProps<T>) {
  const {
    id = "virtual-list",
    className,
    list,
    visibleCount = 10,
    scrollViewProps,
    overScanGroup = 1,
    children: Item,
  } = props;
  const dataGroup = useRef<T[][]>([]);
  const [visibleGroup, setVisibleGroup] = useState<(T[] | { height: number })[]>([]);
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const groupHeightRef = useRef<number[]>([]);
  const windowHeight = useRef<number>(0);
  const scrollTopRef = useRef<number>(0);
  const currentInstance = useRef<ReturnType<typeof getCurrentInstance> | null>(null);

  const miniObserver = useCallback(
    (idx: number) => {
      let scrollHeight = 0;
      if (
        typeof scrollViewProps?.style !== "string" &&
        typeof scrollViewProps?.style?.height === "number"
      ) {
        scrollHeight = scrollViewProps.style.height;
      } else {
        scrollHeight = windowHeight.current;
      }

      if (!currentInstance.current?.page) {
        return;
      }

      const observer = createIntersectionObserver(currentInstance.current.page).relativeToViewport({
        top: overScanGroup * scrollHeight,
        bottom: overScanGroup * scrollHeight,
      });
      observer.observe(`#${id} .item_wrap_${idx}`, res => {
        if (res?.intersectionRatio <= 0) {
          setVisibleGroup(prev => {
            const newVisibleGroup = [...prev];
            newVisibleGroup[idx] = { height: groupHeightRef.current[idx] };
            return newVisibleGroup;
          });
        } else {
          setVisibleGroup(prev => {
            if (Array.isArray(prev[idx])) {
              return prev;
            }
            const newVisibleGroup = [...prev];
            newVisibleGroup[idx] = dataGroup.current[idx];
            return newVisibleGroup;
          });
        }
      });
    },
    [id, overScanGroup, scrollViewProps],
  );

  const setHeight = useCallback(
    (l: T[], idx: number) => {
      const query = createSelectorQuery();
      query.select(`#${id} .item_wrap_${idx}`)?.boundingClientRect();
      query.exec(res => {
        if (!res[0] || !l.length) {
          return;
        }

        groupHeightRef.current[idx] = res[0].height;
      });
      miniObserver(idx);
    },
    [id, miniObserver],
  );

  const groupList = useCallback(
    (ungroupedList: T[], itemCount: number) => {
      const groupCount = Math.ceil(ungroupedList.length / itemCount);
      const result = new Array(groupCount).fill(0).map((_, index) => {
        return ungroupedList.slice(index * itemCount, (index + 1) * itemCount);
      });
      dataGroup.current = result;
      setVisibleGroup([result[0]]);
      setVisibleIndex(0);
      nextTick(() => {
        setHeight(ungroupedList, 0);
      });
    },
    [setHeight],
  );

  const renderNextGroup = useCallback(() => {
    if (visibleIndex < dataGroup.current.length - 1) {
      const nextIdx = visibleIndex + 1;
      const visible = [...visibleGroup];
      visible[nextIdx] = dataGroup.current[nextIdx];
      setVisibleIndex(nextIdx);
      setVisibleGroup([...visible]);
      nextTick(() => {
        setHeight(list, nextIdx);
      });
    }
  }, [list, setHeight, visibleGroup, visibleIndex]);

  const onScrollToLower = useCallback(() => {
    renderNextGroup();
  }, [renderNextGroup]);

  const getSystemInformation = useCallback(() => {
    try {
      const res = getSystemInfoSync();
      windowHeight.current = res.windowHeight;
    } catch (err) {
      console.error(`获取系统信息失败：${err}`);
    }
  }, []);

  const handleScroll = useCallback<BaseEventOrigFunction<ScrollViewProps.onScrollDetail>>(e => {
    const { scrollTop } = e.detail;
    scrollTopRef.current = scrollTop;
  }, []);

  useEffect(() => {
    scrollTopRef.current = Math.random();
  }, [list]);

  useEffect(() => {
    groupList(list, visibleCount);
  }, [groupList, list, visibleCount]);

  useEffect(() => {
    currentInstance.current = getCurrentInstance();
  }, []);

  useEffect(() => {
    getSystemInformation();
  }, [getSystemInformation]);

  return (
    <ScrollView
      scrollY
      {...scrollViewProps}
      className={className}
      id={id}
      lowerThreshold={250}
      scrollTop={scrollTopRef.current}
      onScroll={handleScroll}
      onScrollToLower={onScrollToLower}
    >
      <View className="content-list">
        {visibleGroup.map((group, groupIndex) => {
          return (
            <View key={groupIndex} className={`item_wrap_${groupIndex}`}>
              {Array.isArray(group) ? (
                group.map((item, idxInItem) => (
                  <Item key={idxInItem} item={item} index={groupIndex * visibleCount + idxInItem} />
                ))
              ) : (
                <View style={{ height: group.height }}></View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

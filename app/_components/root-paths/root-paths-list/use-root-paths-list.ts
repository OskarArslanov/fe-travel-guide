"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import { usePathStore } from "@/store/path.store";
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";

export const useRootPathsList = () => {
  const suggestions = usePathStore().path?.suggestions || [];
  const geoLoading = usePathStore().isLoading;
  const { getQueryParams, setQueryParams } = useQueryParams();
  const targetCountry = getQueryParams().targetCountry;

  const [items, setItems] = useState(suggestions);

  const draggableItems = items?.length ? items : suggestions;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = draggableItems.findIndex(
      (i) => i.countryCode === active.id,
    );
    const newIndex = draggableItems.findIndex((i) => i.countryCode === over.id);

    if (oldIndex === -1 || newIndex === -1) return;
    setItems(arrayMove(draggableItems, oldIndex, newIndex));
  }

  return {
    sensors,
    draggableItems,
    targetCountry,
    setTargetCountry: (code?: string) =>
      setQueryParams({ targetCountry: code }),
    handleDragEnd,
    geoLoading,
  };
};

"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import RouteCard from "./root-paths-card";
import { useRootPathsList } from "./use-root-paths-list";

export const RootPathsList = () => {
  const { handleDragEnd, draggableItems, sensors, geoLoading } =
    useRootPathsList();

  if (geoLoading) return <RootPathsListSkeleton />;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={draggableItems.map((i) => i.countryCode)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {draggableItems.map((item, idx) => (
            <RouteCard key={item.countryCode} item={item} index={idx} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

const RootPathsListSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-16 bg-white border border-zinc-100 rounded-xl animate-pulse"
          style={{ opacity: 1 - i * 0.08 }}
        />
      ))}
    </div>
  );
};

"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { PathType } from "../api/path/path-types";
import RouteCard from "./RouteCard";

interface RouteListProps {
  items: PathType[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onReorder: (newItems: PathType[]) => void;
}

export default function RouteList({
  items,
  selectedIndex,
  onSelect,
  onReorder,
}: RouteListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.countryCode === active.id);
    const newIndex = items.findIndex((i) => i.countryCode === over.id);

    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.countryCode)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {items.map((item, idx) => (
            <RouteCard
              key={item.countryCode}
              item={item}
              index={idx}
              isSelected={selectedIndex === idx}
              onSelect={() => onSelect(idx)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

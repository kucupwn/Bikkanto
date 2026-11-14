import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, PointerEvent } from "react";
import styled, { css, keyframes } from "styled-components";
import {
  ChevronDown,
  GripVertical,
  Minus,
  Pencil,
  Plus,
  Save,
  Shuffle,
  Trash2,
  X,
} from "lucide-react";
import { api } from "../../api/api";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import { FlapText } from "../FlapText";
import { Loader } from "../Loader";
import { Board, BoardHead, BoardNote, BoardTitle, Button } from "../ui";
import {
  Head,
  Name,
  No,
  Reps,
  RepsStepper,
  Row,
  Rows,
  Tier,
} from "../BoardRows";
import { getRepsDifficulty } from "../../utils";
import type { Preset, PresetExercise } from "../../types/presetTypes";
import type { Exercise, WorkoutEntry } from "../../types/exerciseTypes";
import { PresetDeleteModal } from "./PresetDeleteModal";

const EmptyBoard = styled(Board)`
  min-height: 320px;
  display: flex;
  flex-direction: column;
`;

const EmptyBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 1.25rem;

  p {
    color: var(--board-ink-2);
    max-width: 44ch;
  }
`;

const Items = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

/* The edit outline is an overlay so the header's background can't cover it. */
const Item = styled.li<{ $editing: boolean }>`
  position: relative;
  border-bottom: 1px solid var(--board-line);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    border: 2px solid
      ${({ $editing }) => ($editing ? "var(--amber)" : "transparent")};
    transition: border-color 0.15s ease;
  }

  &:last-child {
    border-bottom: 0;
  }
`;

/* The toggle's ::after stretches over the whole header, so clicking anywhere
   on the row (chevron included) opens it; the Select button sits above it. */
const Header = styled.div<{ $open: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: ${({ $open }) => ($open ? "var(--board-cell)" : "transparent")};
  transition: background-color 0.15s ease;

  &:hover {
    background: var(--board-cell);
  }

  > svg {
    flex-shrink: 0;
    pointer-events: none;
    color: ${({ $open }) => ($open ? "var(--amber)" : "var(--board-ink-2)")};
    transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
    transition:
      transform 0.25s var(--ease-out),
      color 0.15s ease;
  }
`;

const Toggle = styled.button`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--board-ink);
  text-align: left;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible::after {
    outline: 2px solid var(--amber);
    outline-offset: -2px;
  }
`;

/* Sits above the toggle's overlay; holds the tooltip, since a disabled
   button gets no hover events. */
const SelectWrap = styled.span`
  position: relative;
  z-index: 1;
  flex-shrink: 0;

  button:disabled {
    pointer-events: none;
  }
`;

const PresetName = styled.span`
  min-width: 0;
  font-family: var(--font-board);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.05em;
  line-height: 1.2;
  text-transform: uppercase;
  overflow-wrap: anywhere;

  @media (max-width: 700px) {
    font-size: 20px;
  }
`;

const unfold = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: none; }
`;

/* In edit mode the first column widens to fit the drag handle and the
   remove button. */
const Detail = styled.div<{ $editing: boolean }>`
  border-top: 1px solid var(--board-line);
  animation: ${unfold} 0.22s var(--ease-out);

  ${({ $editing }) =>
    $editing &&
    css`
      ${Head}, ${Row} {
        grid-template-columns: 7.5rem minmax(0, 1fr) 12.5rem 8.5rem;
      }

      @media (max-width: 700px) {
        ${Row} {
          grid-template-columns: 6.5rem minmax(0, 1fr) auto;
        }
      }
    `}
`;

/* In edit mode a row can be grabbed (anywhere with a mouse, by the handle on
   touch) and dragged to a new place. */
const SortableRow = styled(Row)<{ $sortable: boolean; $dragging: boolean }>`
  position: relative;
  transition: background-color 0.15s ease;

  ${({ $sortable }) =>
    $sortable &&
    css`
      cursor: grab;
      user-select: none;

      &:hover {
        background: var(--board-cell);
      }
    `}

  ${({ $dragging }) =>
    $dragging &&
    css`
      z-index: 1;
      cursor: grabbing;
      background: var(--board-cell);
      box-shadow:
        inset 0 0 0 2px var(--amber),
        0 8px 24px rgba(0, 0, 0, 0.45);
    `}
`;

const DragHandle = styled.button<{ $dragging: boolean }>`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 24px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  color: ${({ $dragging }) =>
    $dragging ? "var(--amber)" : "var(--board-ink-2)"};
  cursor: inherit;
  touch-action: none;
  transition: color 0.15s ease;

  &:hover {
    color: var(--board-ink);
  }

  &:focus-visible {
    outline: 2px solid var(--amber);
    outline-offset: 2px;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--board-line);

  @media (max-width: 700px) {
    flex-wrap: wrap;
    padding: 0.75rem 1rem;

    > * {
      flex: 1;
    }
  }
`;

/* Add and Save sit at the far end; on phones they take their own line. */
const EditActions = styled.span`
  display: flex;
  gap: 0.75rem;
  margin-left: auto;

  @media (max-width: 700px) {
    flex-basis: 100%;
    margin-left: 0;

    > * {
      flex: 1;
    }
  }
`;

const NoCell = styled.span`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const RemoveButton = styled.button`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--red);
  border-radius: var(--radius);
  background: transparent;
  color: var(--red);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: var(--red-solid);
    border-color: var(--red-solid);
    color: #fff;
  }

  &:focus-visible {
    outline: 2px solid var(--amber);
    outline-offset: 2px;
  }
`;

/* Holds the tooltip for a disabled action button. */
const ActionWrap = styled.span`
  display: flex;

  > button {
    flex: 1;
  }

  button:disabled {
    pointer-events: none;
  }
`;

/* Secondary button styled for the dark board. */
const BoardGhost = styled(Button)`
  background: transparent;
  color: var(--board-ink);
  border-color: var(--board-line);

  &:hover:not(:disabled) {
    background: var(--board-cell);
    border-color: var(--board-ink-2);
  }
`;

/* The board is always dark, so use the bright red in both themes. */
const BoardDanger = styled(Button)`
  background: transparent;
  color: var(--red);
  border-color: var(--red);

  &:hover:not(:disabled) {
    background: var(--red-solid);
    border-color: var(--red-solid);
    color: #fff;
  }
`;

interface Props {
  // Used to show each entry's reps range for its reps difficulty
  exercises: Exercise[];
  // Without it the empty state shows a hint instead of a create button
  onCreate?: () => void;
  // Without it the list is browse-only and no Select button is shown
  onSelect?: (preset: Preset) => void;
  onEdit?: (preset: Preset) => void;
  // When set, Select is disabled and this is shown as its tooltip
  selectDisabledReason?: string;
  // Preset the workout in progress was started from; its Delete is disabled
  inProgressPresetId?: number | null;
  // Called after a delete also discarded the workout in progress
  onDraftDiscarded?: () => void;
}

interface PendingDelete {
  preset: Preset;
  draftSessionId: string | null;
}

export function PresetList({
  exercises,
  onCreate,
  onSelect,
  onEdit,
  selectDisabledReason,
  inProgressPresetId,
  onDraftDiscarded,
}: Props) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
    null,
  );
  // Working copy of the edited preset's exercises; Cancel throws it away
  const [draft, setDraft] = useState<PresetExercise[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const rowEls = useRef<Map<number, HTMLLIElement>>(new Map());
  const { showRibbon } = useRibbon();

  // Delete is disabled while a workout is in progress, but if a draft from
  // this preset still turns up (e.g. another tab), it is removed with it.
  async function requestDelete(preset: Preset) {
    try {
      const res = await api.get<WorkoutEntry[]>("/history/draft");
      const draft = res.data.find((entry) => entry.preset_id === preset.id);
      setPendingDelete({ preset, draftSessionId: draft?.session_id ?? null });
    } catch {
      showRibbon("error", "Could not check for a workout in progress.");
    }
  }

  function handleDeleted(presetId: number) {
    if (pendingDelete?.draftSessionId) onDraftDiscarded?.();
    setPresets((prev) => prev.filter((p) => p.id !== presetId));
    setPendingDelete(null);
  }

  useEffect(() => {
    async function fetchPresets() {
      try {
        const res = await api.get<Preset[]>("/presets");
        setPresets(res.data);
      } catch {
        showRibbon("error", "Could not fetch presets.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPresets();
  }, []);

  function getExercise(entry: PresetExercise) {
    return exercises.find((ex) => ex.id === entry.exercise_id);
  }

  function getMinReps(entry: PresetExercise) {
    return getExercise(entry)?.easy_min ?? 1;
  }

  // The tier follows the count, the same as on the workout board
  function setDraftReps(entryId: number, reps: number) {
    setDraft((prev) =>
      prev.map((entry) => {
        if (entry.id !== entryId) return entry;
        const exercise = getExercise(entry);
        return {
          ...entry,
          reps,
          reps_difficulty: exercise
            ? getRepsDifficulty(exercise, reps)
            : entry.reps_difficulty,
        };
      }),
    );
  }

  function handleRepsChange(entryId: number, e: ChangeEvent<HTMLInputElement>) {
    setDraftReps(entryId, e.target.value === "" ? 0 : Number(e.target.value));
  }

  // Typing is left free so multi-digit counts can pass through low values;
  // the floor is enforced once the field loses focus.
  function handleRepsBlur(entry: PresetExercise) {
    const minReps = getMinReps(entry);
    if (entry.reps < minReps) setDraftReps(entry.id, minReps);
  }

  function getRepsRange(entry: PresetExercise) {
    const exercise = getExercise(entry);
    if (!exercise) return null;

    const min = exercise[`${entry.reps_difficulty}_min`];
    const max = exercise[`${entry.reps_difficulty}_max`];

    return `${min}-${max}`;
  }

  function toggleOpen(presetId: number) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(presetId)) next.delete(presetId);
      else next.add(presetId);
      return next;
    });
    // Collapsing a preset also leaves its edit mode
    if (editingId === presetId) stopEditing();
  }

  function stopEditing() {
    setEditingId(null);
    setDraft([]);
    setDraggingId(null);
  }

  function toggleEdit(preset: Preset) {
    if (editingId === preset.id) {
      stopEditing();
      return;
    }
    setEditingId(preset.id);
    setDraft(preset.exercises);
    setDraggingId(null);
    onEdit?.(preset);
  }

  function moveEntry(from: number, to: number) {
    setDraft((prev) => {
      if (to < 0 || to >= prev.length || from === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function handleDragStart(e: PointerEvent<HTMLLIElement>, entryId: number) {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    const onHandle = !!target.closest("[data-drag-handle]");
    // Touch drags only from the handle so the page can still scroll
    if (!onHandle && e.pointerType === "touch") return;
    // Other controls in the row (remove, reps stepper) keep their own input
    if (!onHandle && target.closest("button, input")) return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingId(entryId);
  }

  // Swaps the dragged row past a neighbour once the pointer crosses its middle
  function handleDragMove(e: PointerEvent<HTMLLIElement>) {
    if (draggingId === null) return;
    const index = draft.findIndex((entry) => entry.id === draggingId);
    if (index === -1) return;

    let to = index;
    while (to > 0) {
      const el = rowEls.current.get(draft[to - 1].id);
      if (!el) break;
      const rect = el.getBoundingClientRect();
      if (e.clientY >= rect.top + rect.height / 2) break;
      to--;
    }
    while (to === index && to < draft.length - 1) {
      const el = rowEls.current.get(draft[to + 1].id);
      if (!el) break;
      const rect = el.getBoundingClientRect();
      if (e.clientY <= rect.top + rect.height / 2) break;
      to++;
    }
    if (to !== index) moveEntry(index, to);
  }

  function handleDragEnd() {
    setDraggingId(null);
  }

  function handleHandleKey(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    moveEntry(index, e.key === "ArrowUp" ? index - 1 : index + 1);
  }

  function isDraftChanged(preset: Preset) {
    return draft.some((entry, i) => {
      const saved = preset.exercises[i];
      return entry.id !== saved?.id || entry.reps !== saved.reps;
    });
  }

  function isDraftValid() {
    return draft.every((entry) => entry.reps >= getMinReps(entry));
  }

  async function savePreset(preset: Preset) {
    setIsSaving(true);
    try {
      const res = await api.put<Preset>(`/presets/${preset.id}`, {
        preset_name: preset.preset_name,
        // List order becomes each exercise's position
        exercises: draft.map(({ exercise_id, reps_difficulty, reps }) => ({
          exercise_id,
          reps_difficulty,
          reps,
        })),
      });
      setPresets((prev) =>
        prev.map((p) => (p.id === preset.id ? res.data : p)),
      );
      stopEditing();
      showRibbon("success", "Preset saved.");
    } catch {
      showRibbon("error", "Could not save preset.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Loader />;

  if (presets.length === 0) {
    return (
      <EmptyBoard as="section" aria-labelledby="presets-title">
        <BoardHead>
          <BoardTitle id="presets-title">Presets</BoardTitle>
          <BoardNote>0 saved</BoardNote>
        </BoardHead>
        <EmptyBody>
          <FlapText text="No presets" cells size="md" tone="muted" />
          {onCreate ? (
            <>
              <p>
                Accept a workout, then use Save to presets to keep it here for
                next time.
              </p>
              <Button $variant="primary" onClick={onCreate}>
                <Shuffle size={18} aria-hidden="true" />
                Create a workout
              </Button>
            </>
          ) : (
            <p>No presets yet. Use Create preset to build your first one.</p>
          )}
        </EmptyBody>
      </EmptyBoard>
    );
  }

  return (
    <Board as="section" aria-labelledby="presets-title">
      <BoardHead>
        <BoardTitle id="presets-title">Presets</BoardTitle>
        <BoardNote>{presets.length} saved</BoardNote>
      </BoardHead>
      <Items>
        {presets.map((preset) => {
          const isOpen = openIds.has(preset.id);
          const detailId = `preset-${preset.id}-exercises`;
          const count = preset.exercises.length;
          const isInProgress = preset.id === inProgressPresetId;
          const isEditing = preset.id === editingId;
          const deleteDisabledReason = isInProgress
            ? "Finish or discard your workout in progress first"
            : isEditing
              ? "Save or cancel your changes first"
              : undefined;
          // Cancel stays available so an open edit can always be left
          const editDisabledReason =
            isInProgress && !isEditing
              ? "Finish or discard your workout in progress first"
              : undefined;

          return (
            <Item key={preset.id} $editing={isEditing}>
              <Header $open={isOpen}>
                <Toggle
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={detailId}
                  onClick={() => toggleOpen(preset.id)}
                >
                  <PresetName>{preset.preset_name}</PresetName>
                  <BoardNote>
                    {count} {count === 1 ? "exercise" : "exercises"}
                  </BoardNote>
                </Toggle>
                {onSelect && (
                  <SelectWrap title={selectDisabledReason}>
                    <Button
                      type="button"
                      $variant="primary"
                      onClick={() => onSelect(preset)}
                      disabled={!!selectDisabledReason}
                      aria-label={`Select preset ${preset.preset_name}`}
                    >
                      Select
                    </Button>
                  </SelectWrap>
                )}
                <ChevronDown size={20} aria-hidden="true" />
              </Header>
              {isOpen && (
                <Detail id={detailId} $editing={isEditing}>
                  <Actions>
                    <ActionWrap title={deleteDisabledReason}>
                      <BoardDanger
                        type="button"
                        onClick={() => requestDelete(preset)}
                        disabled={!!deleteDisabledReason}
                        aria-label={`Delete preset ${preset.preset_name}`}
                      >
                        <Trash2 size={18} aria-hidden="true" />
                        Delete
                      </BoardDanger>
                    </ActionWrap>
                    <ActionWrap title={editDisabledReason}>
                      <BoardGhost
                        type="button"
                        onClick={() => toggleEdit(preset)}
                        disabled={!!editDisabledReason}
                        aria-label={
                          isEditing
                            ? `Cancel editing preset ${preset.preset_name}`
                            : `Edit preset ${preset.preset_name}`
                        }
                      >
                        {isEditing ? (
                          <X size={18} aria-hidden="true" />
                        ) : (
                          <Pencil size={18} aria-hidden="true" />
                        )}
                        {isEditing ? "Cancel" : "Edit"}
                      </BoardGhost>
                    </ActionWrap>
                    {isEditing && (
                      <EditActions>
                        <BoardGhost
                          type="button"
                          aria-label={`Add exercise to preset ${preset.preset_name}`}
                        >
                          <Plus size={18} aria-hidden="true" />
                          Add
                        </BoardGhost>
                        <ActionWrap
                          title={
                            !isDraftChanged(preset)
                              ? "No changes to save"
                              : !isDraftValid()
                                ? "Reps can't be below the easy minimum"
                                : undefined
                          }
                        >
                          <Button
                            type="button"
                            $variant="primary"
                            onClick={() => savePreset(preset)}
                            disabled={
                              isSaving ||
                              !isDraftChanged(preset) ||
                              !isDraftValid()
                            }
                            aria-label={`Save preset ${preset.preset_name}`}
                          >
                            <Save size={18} aria-hidden="true" />
                            {isSaving ? "Saving" : "Save"}
                          </Button>
                        </ActionWrap>
                      </EditActions>
                    )}
                  </Actions>
                  <Head aria-hidden="true" $withReroll={false}>
                    <span>No</span>
                    <span>Exercise</span>
                    <span>Tier</span>
                    <span>Reps</span>
                  </Head>
                  <Rows>
                    {(isEditing ? draft : preset.exercises).map((entry, index) => (
                      <SortableRow
                        key={entry.id}
                        $withReroll={false}
                        $sortable={isEditing}
                        $dragging={isEditing && draggingId === entry.id}
                        ref={(el: HTMLLIElement | null) => {
                          if (el) rowEls.current.set(entry.id, el);
                          else rowEls.current.delete(entry.id);
                        }}
                        {...(isEditing && {
                          onPointerDown: (e: PointerEvent<HTMLLIElement>) =>
                            handleDragStart(e, entry.id),
                          onPointerMove: handleDragMove,
                          onPointerUp: handleDragEnd,
                          onPointerCancel: handleDragEnd,
                        })}
                      >
                        {isEditing ? (
                          <NoCell>
                            <DragHandle
                              type="button"
                              data-drag-handle
                              $dragging={draggingId === entry.id}
                              onKeyDown={(e) => handleHandleKey(e, index)}
                              aria-label={`Reorder ${entry.exercise_name}, position ${index + 1} of ${draft.length}. Use arrow keys to move.`}
                            >
                              <GripVertical size={18} aria-hidden="true" />
                            </DragHandle>
                            <No>{String(index + 1).padStart(2, "0")}</No>
                            <RemoveButton
                              type="button"
                              aria-label={`Remove ${entry.exercise_name} from preset`}
                            >
                              <X size={16} aria-hidden="true" />
                            </RemoveButton>
                          </NoCell>
                        ) : (
                          <No>{String(index + 1).padStart(2, "0")}</No>
                        )}
                        <Name>
                          <FlapText
                            text={entry.exercise_name}
                            animateOnMount
                            delay={index * 90}
                          />
                          <small>{entry.category_name}</small>
                        </Name>
                        <Tier>
                          <b>{entry.difficulty}</b> · {entry.reps_difficulty}
                          {getRepsRange(entry) && ` (${getRepsRange(entry)})`}
                        </Tier>
                        <Reps>
                          {isEditing ? (
                            <RepsStepper>
                              <button
                                type="button"
                                aria-label={`Fewer reps for ${entry.exercise_name}`}
                                disabled={entry.reps <= getMinReps(entry)}
                                onClick={() =>
                                  setDraftReps(entry.id, entry.reps - 1)
                                }
                              >
                                <Minus size={16} aria-hidden="true" />
                              </button>
                              <input
                                type="number"
                                inputMode="numeric"
                                min={getMinReps(entry)}
                                aria-label={`Reps for ${entry.exercise_name}`}
                                value={entry.reps || ""}
                                onChange={(e) => handleRepsChange(entry.id, e)}
                                onBlur={() => handleRepsBlur(entry)}
                              />
                              <button
                                type="button"
                                aria-label={`More reps for ${entry.exercise_name}`}
                                onClick={() =>
                                  setDraftReps(entry.id, entry.reps + 1)
                                }
                              >
                                <Plus size={16} aria-hidden="true" />
                              </button>
                            </RepsStepper>
                          ) : (
                            <FlapText
                              text={entry.reps}
                              cells
                              size="lg"
                              pad={2}
                              animateOnMount
                              delay={index * 90 + 120}
                              tone="amber"
                            />
                          )}
                        </Reps>
                      </SortableRow>
                    ))}
                  </Rows>
                </Detail>
              )}
            </Item>
          );
        })}
      </Items>
      {pendingDelete && (
        <PresetDeleteModal
          preset={pendingDelete.preset}
          draftSessionId={pendingDelete.draftSessionId}
          onClose={() => setPendingDelete(null)}
          onDeleted={handleDeleted}
        />
      )}
    </Board>
  );
}

import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import {
  ChevronDown,
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
import { Head, Name, No, Reps, Row, Rows, Tier } from "./SummaryTable";
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

/* In edit mode the first column widens to fit the remove button. */
const Detail = styled.div<{ $editing: boolean }>`
  border-top: 1px solid var(--board-line);
  animation: ${unfold} 0.22s var(--ease-out);

  ${({ $editing }) =>
    $editing &&
    css`
      ${Head}, ${Row} {
        grid-template-columns: 5.5rem minmax(0, 1fr) 12.5rem 8.5rem;
      }

      @media (max-width: 700px) {
        ${Row} {
          grid-template-columns: 4.5rem minmax(0, 1fr) auto;
        }
      }
    `}
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
  onCreate: () => void;
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

  function getRepsRange(entry: PresetExercise) {
    const exercise = exercises.find((ex) => ex.id === entry.exercise_id);
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
    if (editingId === presetId) setEditingId(null);
  }

  function toggleEdit(preset: Preset) {
    if (editingId === preset.id) {
      setEditingId(null);
      return;
    }
    setEditingId(preset.id);
    onEdit?.(preset);
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
          <p>
            Accept a workout, then use Save to presets to keep it here for
            next time.
          </p>
          {!selectDisabledReason && (
            <Button $variant="primary" onClick={onCreate}>
              <Shuffle size={18} aria-hidden="true" />
              Create a workout
            </Button>
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
                <SelectWrap title={selectDisabledReason}>
                  <Button
                    type="button"
                    $variant="primary"
                    onClick={() => onSelect?.(preset)}
                    disabled={!!selectDisabledReason}
                    aria-label={`Select preset ${preset.preset_name}`}
                  >
                    Select
                  </Button>
                </SelectWrap>
                <ChevronDown size={20} aria-hidden="true" />
              </Header>
              {isOpen && (
                <Detail id={detailId} $editing={isEditing}>
                  <Actions>
                    <ActionWrap
                      title={
                        isInProgress
                          ? "Finish or discard your workout in progress first"
                          : undefined
                      }
                    >
                      <BoardDanger
                        type="button"
                        onClick={() => requestDelete(preset)}
                        disabled={isInProgress}
                        aria-label={`Delete preset ${preset.preset_name}`}
                      >
                        <Trash2 size={18} aria-hidden="true" />
                        Delete
                      </BoardDanger>
                    </ActionWrap>
                    <BoardGhost
                      type="button"
                      onClick={() => toggleEdit(preset)}
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
                    {isEditing && (
                      <EditActions>
                        <BoardGhost
                          type="button"
                          aria-label={`Add exercise to preset ${preset.preset_name}`}
                        >
                          <Plus size={18} aria-hidden="true" />
                          Add
                        </BoardGhost>
                        <Button
                          type="button"
                          $variant="primary"
                          aria-label={`Save preset ${preset.preset_name}`}
                        >
                          <Save size={18} aria-hidden="true" />
                          Save
                        </Button>
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
                    {preset.exercises.map((entry, index) => (
                      <Row key={entry.id} $withReroll={false}>
                        {isEditing ? (
                          <NoCell>
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
                          <FlapText
                            text={entry.reps}
                            cells
                            size="lg"
                            pad={2}
                            animateOnMount
                            delay={index * 90 + 120}
                            tone="amber"
                          />
                        </Reps>
                      </Row>
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

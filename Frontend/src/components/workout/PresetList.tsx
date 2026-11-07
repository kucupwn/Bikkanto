import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { ChevronDown, Shuffle } from "lucide-react";
import { api } from "../../api/api";
import { useRibbon } from "../feedbackRibbon/RibbonProvider";
import { FlapText } from "../FlapText";
import { Loader } from "../Loader";
import { Board, BoardHead, BoardNote, BoardTitle, Button } from "../ui";
import { Head, Name, No, Reps, Row, Rows, Tier } from "./SummaryTable";
import type { Preset } from "../../types/presetTypes";

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

const Item = styled.li`
  border-bottom: 1px solid var(--board-line);

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

const SelectButton = styled(Button)`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
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

const Detail = styled.div`
  border-top: 1px solid var(--board-line);
  animation: ${unfold} 0.22s var(--ease-out);
`;

interface Props {
  onCreate: () => void;
  onSelect?: (preset: Preset) => void;
}

export function PresetList({ onCreate, onSelect }: Props) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());
  const { showRibbon } = useRibbon();

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

  function toggleOpen(presetId: number) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(presetId)) next.delete(presetId);
      else next.add(presetId);
      return next;
    });
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
          <Button $variant="primary" onClick={onCreate}>
            <Shuffle size={18} aria-hidden="true" />
            Create a workout
          </Button>
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

          return (
            <Item key={preset.id}>
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
                <SelectButton
                  type="button"
                  $variant="primary"
                  onClick={() => onSelect?.(preset)}
                  aria-label={`Select preset ${preset.preset_name}`}
                >
                  Select
                </SelectButton>
                <ChevronDown size={20} aria-hidden="true" />
              </Header>
              {isOpen && (
                <Detail id={detailId}>
                  <Head aria-hidden="true" $withReroll={false}>
                    <span>No</span>
                    <span>Exercise</span>
                    <span>Tier</span>
                    <span>Reps</span>
                  </Head>
                  <Rows>
                    {preset.exercises.map((entry, index) => (
                      <Row key={entry.id} $withReroll={false}>
                        <No>{String(index + 1).padStart(2, "0")}</No>
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
    </Board>
  );
}

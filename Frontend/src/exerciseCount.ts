function fillExerciseCount(selectId: string, start: number, stop: number): void {
    const exerciseCount = document.getElementById(selectId) as HTMLSelectElement | null;
    if (!exerciseCount) return

    exerciseCount.innerHTML = ''

    for (let i=start; i<=stop; i++) {
        let option = document.createElement('option');
        option.value = String(i);
        option.textContent = String(i);
        exerciseCount.appendChild(option)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fillExerciseCount('exercise-count', 1, 20)
})
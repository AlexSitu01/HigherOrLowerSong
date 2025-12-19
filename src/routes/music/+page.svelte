<script lang="ts">
    import {highscore} from '../../globalState.svelte'
    interface Props {

    }
    const {data} = $props()

    let score = $state(0)
    const incrementScore = () => {
        score++
    }
</script>

<div class="h-screen w-screen flex justify-center items-center gap-y-4 flex-col">
	<div class="dsf justify-self-center">{score}</div>
    <div>{highscore.value}</div>
	<button class="rounded-2xl border-2 px-3 py-2cursor-pointer" onclick={incrementScore}>test</button>
    <button class="rounded-2xl border-2 px-3 py-2 cursor-pointer" onclick={() => {highscore.updateScore(score)}}>update Highscore</button>

    <button class="rounded-2xl border-2 px-3 py-2 cursor-pointer" onclick={() => console.log(data)}>Console spotify api</button>
</div>

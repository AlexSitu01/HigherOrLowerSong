<script lang="ts">
	interface Props {
		popularity: number;
	}

	const { popularity }: Props = $props();
</script>

<div class="rounded-2xl border-2 p-3 flex flex-col justify-center items-center shadow-sm">
    <span class="uppercase">Popularity</span>
    <span class="text-4xl font-semibold">{popularity}%</span>
</div>

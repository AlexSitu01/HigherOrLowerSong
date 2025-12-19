<script lang="ts">
    import { page } from "$app/state";
</script>

<div class="h-screen w-full self-center justify-self-center">{page.error?.message}</div>
<script>
    import { roomViewIcons } from '$lib/utils/room-view-icons';
</script>

<div class="flex gap-4 mt-4 p-2 border">
    {#each Object.entries(roomViewIcons) as [status, { url, color }]}
        <div class="flex items-center gap-2">
            <img
                src={url}
                alt={status}
                loading="lazy"
                class={`py-1 px-6 ${color}`}
            />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
    {/each}
</div>

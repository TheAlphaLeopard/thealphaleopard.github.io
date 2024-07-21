const client = StreamChat.getInstance("ca6hrf5aegvj");
const channel = client.channel('messaging', 'travel', {
    name: 'Awesome channel about traveling',
});

// fetch the channel state, subscribe to future updates
const state = await channel.watch();

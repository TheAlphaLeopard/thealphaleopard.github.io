const client = StreamChat.getInstance("ca6hrf5aegvj");

await client.connectUser(
    {
        id: 'jlahey',
        name: 'Jim Lahey',
        image: 'https://i.imgur.com/fR9Jz14.png',
    },
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoid2ludGVyLXJpY2UtMyJ9.BjFfkIZXWShnxDBuyYlLO67PEhP2MYkpGjqi7GBQKWs",
);

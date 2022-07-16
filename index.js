Router.get("/", () => new Response(`
<script>const roomId = new URL(location.href).searchParams.get("roomId") || "default";
new EventSource(\`/_blueboat/events?ns=chatroom&topic=\${encodeURIComponent(roomId)}\`)
  .addEventListener("message", e => pre.textContent += e.data + "\\n");
const send = message => fetch('/broadcast', { method: 'POST', body: JSON.stringify({ roomId, message }) });
</script><input onkeyup="event.key=='Enter'&&send(this.value)"><pre id=pre>
`, { headers: { "content-type": "text/html" } }));

Router.post("/broadcast", async req => {
  const { roomId, message } = await req.json();
  await App.pubsub.chatroom.publish(roomId, message);
  return new Response("ok");
});

App.pubsub.chatroom.authorizeClient(() => true);
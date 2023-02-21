## Topics posts formats

Note that the content section is stringified as JSON

### Create Topic (TOPICS) [PUBLIC CHANEL]

```javascript
{
    id: "",
    sig: "",
    kind: 40, // Create channel tag
    tags: [["arguflow"]],
    content: JSON.stringify({
        name: "Topic Of Debate",
        about: "Description tag",
        picture: "", // TODO add pictures later
    }),
}
```

### Create Topic-Value

topicEventId is a number

```javascript
{
    id: "",
    sig: "",
    kind: 42,
    pubkey: "eventPublicKey",
    tags: [
        ["arguflow"],
        ["arguflow-topic-value"],
        ["e",  `${topicEventId}`, "nostr.arguflow.gg", "root"],
    ],
    created_at: "createdAt",
    content: JSON.stringify({
        name: "name",
        description: "description",
        topicEventId: "topicEventId",
    }),
}
```

### Create Statement

Anything in an argument channel that is not a Topic-Value
They will all reference the current topicValue

```javascript
{
    id: "",
    sig: "",
    kind: 1,
    pubkey: "eventPublicKey",
    tags: [
        ["arguflow"],
        ["arguflow-statement"],
        ["e", `${previousEvent}`, "nostr.arguflow.gg", "reply"],
        ["p", ...previousPubKeys], // Reference what it is replying too
    ],
    created_at: "createdAt",
    content: JSON.stringify({
        argument: "",
        topicEventId: `${topicEventId}`,
        type: "aff" | "neg";
        previousEvent: `${prevEvent}`, // corrsponds to what we reply to first
    }),
}
```

The statements will essentially create a linked list with the values being the head
of the linked list. Since we can only fully traceback the arguments in reverse.
In graph terms, we have 1 in going edge and N outgoing.

### Feed

A statement is a single message (atomic)
A feed is a string of the same message.

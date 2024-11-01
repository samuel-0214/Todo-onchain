export type TodoSolana = {
  "address": "sA62Db23P2TJsM9UBV6JDNSG3L4esgdxFcM5norjfv4",
  "metadata": {
    "name": "todo_solana",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "add_todos",
      "discriminator": [
        208,
        169,
        205,
        189,
        250,
        70,
        14,
        79
      ],
      "accounts": [
        {
          "name": "todo_account",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "description",
          "type": {
            "defined": "string"
          }
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "todo_account",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "update_todos",
      "discriminator": [
        203,
        100,
        35,
        225,
        218,
        63,
        81,
        216
      ],
      "accounts": [
        {
          "name": "todo_account",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "index",
          "type": {
            "defined": "u8"
          }
        },
        {
          "name": "is_completed",
          "type": {
            "defined": "bool"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "TodoAccount",
      "discriminator": [
        31,
        86,
        84,
        40,
        187,
        31,
        251,
        132
      ]
    }
  ],
  "types": [
    {
      "name": "Todo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "description",
            "type": {
              "defined": "string"
            }
          },
          {
            "name": "is_completed",
            "type": {
              "defined": "bool"
            }
          }
        ]
      }
    },
    {
      "name": "TodoAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "total_todos",
            "type": {
              "defined": "u64"
            }
          },
          {
            "name": "todos",
            "type": {
              "vec": {
                "defined": "Todo"
              }
            }
          }
        ]
      }
    }
  ]
}

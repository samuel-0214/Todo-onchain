import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoSolana } from "../target/types/todo_solana";
import { assert } from "chai";
import { SystemProgram } from "@solana/web3.js"

describe("todo_solana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TodoSolana as Program<TodoSolana>;
  const provider = anchor.AnchorProvider.env();

  let todoAccount = anchor.web3.Keypair.generate();

  it("Initializes the Todo account", async () => {
    // Initialize the account
    await program.methods
      .initialize()
      .accounts({
        todoAccount: todoAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([todoAccount])
      .rpc();

    // Fetch the account data
    const accountData = await program.account.todoAccount.fetch(
      todoAccount.publicKey
    );

    // Check if initialization worked as expected
    assert.equal(accountData.totalTodos.toNumber(), 0);
    assert.deepEqual(accountData.todos, []);
    console.log("Initialization successful:", accountData);
  });

  it("Adds a new todo", async () => {
    const description = "Complete Solana Todo DApp";

    // Add a new todo item
    await program.methods
      .addTodos(description)
      .accounts({
        todoAccount: todoAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    // Fetch the account data
    const accountData = await program.account.todoAccount.fetch(
      todoAccount.publicKey
    );

    // Verify the new todo item
    assert.equal(accountData.totalTodos.toNumber(), 1);
    assert.equal(accountData.todos[0].description, description);
    assert.equal(accountData.todos[0].isCompleted, false);
    console.log("Todo added successfully:", accountData.todos[0]);
  });

  it("Updates a todo item", async () => {
    const index = 0;
    const isCompleted = true;

    // Update the todo item at index 0
    await program.methods
      .updateTodos(index, isCompleted)
      .accounts({
        todoAccount: todoAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    // Fetch the account data
    const accountData = await program.account.todoAccount.fetch(
      todoAccount.publicKey
    );

    // Verify the todo item was updated
    assert.equal(accountData.todos[0].isCompleted, isCompleted);
    console.log("Todo updated successfully:", accountData.todos[0]);
  });
});

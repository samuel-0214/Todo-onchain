import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoSolana } from "../target/types/todo_solana";
import { assert } from "chai";
import { SystemProgram } from "@solana/web3.js";

describe("todo_solana", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TodoSolana as Program<TodoSolana>;
  const provider = anchor.AnchorProvider.env();

  const signer = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([57, 94, 78, 105, 84, 231, 243, 61, 33, 102, 190, 87, 41, 25, 166, 211, 196, 181, 132, 168, 21, 188, 101, 198, 174, 44, 22, 174, 9, 10, 189, 147, 103, 244, 206, 34, 252, 162, 15, 21, 76, 95, 224, 213, 48, 19, 243, 204, 57, 157, 244, 162, 144, 175, 176, 245, 4, 225, 26, 14, 234, 126, 17, 149])
  );

  let todo_account: anchor.web3.PublicKey; // Ensure this matches your Rust account name

  before(async () => {
    todo_account = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("TODO_ACC"), // Ensure this matches the seed in Rust
        signer.publicKey.toBuffer(),
      ],
      program.programId
    ).then(([publicKey]) => publicKey);
  });

  it("Initializes the Todo account", async () => {
    await program.methods
      .initialize()
      .accounts({
        todo_account: todo_account, // Corrected account name here
        signer: signer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([signer])
      .rpc();

    const accountData = await program.account.todoState.fetch(todo_account); // Use corrected account name
    assert.equal(accountData.totalTodos.toNumber(), 0);
    assert.deepEqual(accountData.todos, []);
    console.log("Initialization successful:", accountData);
  });

  it("Adds a new todo", async () => {
    const description = "Complete Solana Todo DApp";

    await program.methods
      .addTodos(description) // Ensure method name matches your Rust code
      .accounts({
        todo_account: todo_account, // Corrected account name
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    const accountData = await program.account.todoState.fetch(todo_account);
    assert.equal(accountData.totalTodos.toNumber(), 1);
    assert.equal(accountData.todos[0].description, description);
    assert.equal(accountData.todos[0].isCompleted, false);
    console.log("Todo added successfully:", accountData.todos[0]);
  });

  it("Updates a todo item", async () => {
    const index = 0; // Index of the todo to update
    const isCompleted = true;

    await program.methods
      .updateTodos(index, isCompleted) // Ensure method name matches your Rust code
      .accounts({
        todo_account: todo_account, // Corrected account name
        signer: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    const accountData = await program.account.todoState.fetch(todo_account);
    assert.equal(accountData.todos[0].isCompleted, isCompleted);
    console.log("Todo updated successfully:", accountData.todos[0]);
  });
});

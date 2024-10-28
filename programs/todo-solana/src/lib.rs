use anchor_lang::prelude::*;

declare_id!("sA62Db23P2TJsM9UBV6JDNSG3L4esgdxFcM5norjfv4");

#[program]
pub mod todo_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Before initialization of the Account");
        let todo_account = &mut ctx.accounts.todo_account;
        todo_account.total_todos = 0;
        msg!("After initialization of the Account");
        Ok(())
    }

    pub fn add_todos(ctx: Context<AddTodo>, description: String) -> Result<()> {
        msg!("Before adding the todo");
        let todo_account = &mut ctx.accounts.todo_account;
        let todo = Todo{
            description,
            is_completed : false,
        };
        todo_account.todos.push(todo);
        todo_account.total_todos += 1;
        msg!("After adding the todo");
        Ok(())
    }
    
    pub fn update_todos(ctx: Context<UpdateTodo>, index:u8, is_completed : bool) -> Result<()> {
        msg!("Before updating the todo");
        let todo_account = &mut ctx.accounts.todo_account;
        todo_account.todos[index as usize].is_completed = is_completed;
        Ok(())
    }
}

#[account]
pub struct TodoAccount {
    pub total_todos : u64,
    pub todos: Vec<Todo>
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Todo {
    pub description: String,
    pub is_completed: bool,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,payer = user,space = 9000)]
    pub todo_account : Account<'info,TodoAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info,System>,
}

#[derive(Accounts)]
pub struct AddTodo<'info>{
    #[account(mut)]
    pub todo_account: Account<'info, TodoAccount>,
    #[account(mut)]
    pub user : Signer<'info>
}

#[derive(Accounts)]
pub struct UpdateTodo<'info>{
    #[account(mut)]
    pub todo_account: Account<'info, TodoAccount>,
    #[account(mut)]
    pub user : Signer<'info>
}

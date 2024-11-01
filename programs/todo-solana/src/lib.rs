use anchor_lang::prelude::*;

declare_id!("sA62Db23P2TJsM9UBV6JDNSG3L4esgdxFcM5norjfv4");

#[program]
pub mod todo_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let todo_state = &mut ctx.accounts.todo_account;
        todo_state.bump = ctx.bumps.todo_account;
        todo_state.key = ctx.accounts.signer.key(); 
        todo_state.total_todos = 0; 
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
        let todo_state=&mut ctx.accounts.todo_account;
        msg!("Before updating the todo"); 
        let i=index as usize;
        todo_state.todos[i].is_completed=is_completed;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        seeds=[b"TODO_ACC", signer.key().as_ref()],
        payer=signer,
        bump,
        space=8 + TodoState::INIT_SPACE,
    )]
    pub todo_account: Account<'info, TodoState>,
    pub system_program: Program<'info, System>, // Add this line
}


#[derive(Accounts)]
pub struct AddTodo<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(
        mut,
        seeds=[b"TODO_ACC",signer.key().as_ref()],
        bump=todo_account.bump
    )]
    pub todo_account:Account<'info,TodoState>,
}

#[derive(Accounts)]
pub struct UpdateTodo<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(
        mut,
        seeds=[b"TODO_ACC",signer.key().as_ref()],
        bump=todo_account.bump
    )]
    pub todo_account:Account<'info,TodoState>,
}


#[account]
#[derive(InitSpace)]
pub struct TodoState{
    pub key:Pubkey,
    pub bump:u8,
    #[max_len(10,5)]
    pub todos:Vec<Todo>,
    pub total_todos:u64
}

#[derive(AnchorDeserialize,AnchorSerialize,Clone,Debug,InitSpace)]
pub struct Todo{
    #[max_len(50)]
    pub description:String,
    pub is_completed:bool,
}

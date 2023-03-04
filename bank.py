class bank:
    def __init__(q):
        q.users={}
    def createuser(q,name,password):
        q.users[name]={'password':password,'balance':0,'history':[]}
    def deleteuser(q,name):
        try:
            del q.users[name]
            print(f'user : {name} is deleted')
        except:
            print("user doesn't exist")
    def login(q,name):
        try:
            q.account=q.users[name]
        except:
            print('user does not exists')
    def logout(q):
        q.account=0
    def deposit(q,amount):
        if not q.account or q.account==0:
            print('First login before depositing')
        else:
            q.account['balance']+=amount
            q.account['history'].append(f'amount deposited {amount}')
            print(f"Your Balance  is {q.account['balance']}")
    def withdraw(q,amount):
        if not q.account or q.account==0:
            print('First login before withdrawing')
            
        elif q.account['balance']<amount:
            print('insufficient funds')
        else:
            q.account['balance']-=amount
            q.account['history'].append(f'amount withdrawed {amount}')
            print(f"Your Balance  is {q.account['balance']}")
    def accountdetails(q):
        if not q.account or q.account==0:
            print('First login before withdrawing')
        else:
            print(q.account)
    def showusers(q):
        print(q.users.keys())

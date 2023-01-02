import customtkinter as ctk
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split as tt
from sklearn.metrics import r2_score as a
from sklearn.ensemble import RandomForestRegressor as rdr



class fpma:
    def __init__(q):
        
        ctk.set_appearance_mode('dark')
        ctk.set_default_color_theme('dark-blue')
        q.window=ctk.CTk()
        q.window.geometry('600x400')

       
        q.frame = ctk.CTkFrame(master=q.window)
        q.frame.pack(pady=20,padx=60,fill='both',expand=True)
        q.label=ctk.CTkLabel(master=q.frame,text='FPMA',text_font=('Roboto',24))
        q.label.pack(pady=12,padx=10)
        q.e1=ctk.CTkEntry(master=q.frame,placeholder_text='Region')
        q.e1.pack(pady=12,padx=10)
        q.e2=ctk.CTkEntry(master=q.frame,placeholder_text='Sub-Category')
        q.e2.pack(pady=12,padx=10)
        q.button=ctk.CTkButton(master=q.frame,text='GET PREDICTION',command=q.algo)
        q.button.pack(pady=12,padx=10)
        q.window.mainloop()
    def algo(q):
        
        g=pd.read_csv('SampleSuperstore.csv')
        #g[g['Category']=='Furniture']['Sub-Category'].unique()
        h=g[g['Category']=='Office Supplies']['Sub-Category'].unique()
        #g[g['Category']=='Technology']['Sub-Category'].unique()
        cr=g.iloc[:,6:]
        cr.Region.replace(['South', 'West', 'Central', 'East'],[0,1,2,3],inplace=True)
        cr.Category.unique()
        cr.Category.replace(['Furniture', 'Office Supplies', 'Technology'],[1,2,3],inplace=True)
        cr['Sub-Category'].unique()
        cr['Sub-Category'].replace(['Bookcases', 'Chairs', 'Labels', 'Tables', 'Storage',
            'Furnishings', 'Art', 'Phones', 'Binders', 'Appliances', 'Paper',
            'Accessories', 'Envelopes', 'Fasteners', 'Supplies', 'Machines',
            'Copiers'],list(range(17)),inplace=True)
        '''h=g[g['Category']=='Furniture']['Sub-Category'].unique()
        #h=g[g['Category']=='Office Supplies']['Sub-Category'].unique()
        #h=g[g['Category']=='Technology']['Sub-Category'].unique()
        l=['Bookcases', 'Chairs', 'Labels', 'Tables', 'Storage',
            'Furnishings', 'Art', 'Phones', 'Binders', 'Appliances', 'Paper',
            'Accessories', 'Envelopes', 'Fasteners', 'Supplies', 'Machines',
            'Copiers']
        [l.index(i) for i in l if i in h]'''
        xtr,xte,ytr,yte=tt(cr.iloc[:,[0,1,2,3,5,6]],cr.iloc[:,[4]],test_size=0.3)
        r=rdr()
        r.fit(xtr,ytr)
        h=r.predict(xte)
        a(yte,h)
        cr.mean()
        def validate(g):
            dict={'Furniture':0 ,'Office Supplies':1,'Technology':2}
            if g in [0,1,3,5]:return dict['Furniture']
            elif g in [2,4,6,8,9,10,12,13,14]:return dict['Office Supplies']
            elif g in [7, 11, 15, 16]:return dict['Technology']
            else:return 'no category found'
        def inputv(z,k):
            out=[]
            u=['SOUTH', 'WEST', 'CENTRAL', 'EAST']
            if z.upper() in u:out.append(u.index(z.upper()))
            else:return 'no region found'
            l=['bookcases', 'chairs', 'labels', 'tables', 'storage',
            'furnishings', 'art', 'phones', 'binders', 'appliances', 'paper',
            'accessories', 'envelopes', 'fasteners', 'supplies', 'machines',
            'copiers']
            if k.lower() in l:out=out+[validate(l.index(k.lower())),l.index(k.lower())]
            else:return 'no subcategory found'
            return out
        def test(a,b):
            x,y=a,b
            k= inputv(x,y)+[ 229.858001,0.156203,28.656896,]
            return pd.Series(k)
        q.l1=ctk.CTkLabel(master=q.frame,text=f'{str(r.predict(np.array(test(q.e1.get(),q.e2.get())).reshape(1,-1)))[1:-1]} no of {q.e2.get()} will be sold in {q.e1.get()} Region ')
        q.l1.pack(pady=12,padx=10)
fpma()



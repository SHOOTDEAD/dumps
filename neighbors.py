class cgofl():
    def __init__(q):
        pass
    def n(q,m):
        global p
        
        
        p=[]
        for i in range(len(m)):
            for j in range(len(m[0])):
                if (i==0 or i==len(m)-1) and (j==0 or j==len(m[0])-1):
                    if i==0 and j==0:p.append([j+1,j+len(m[0]),j+len(m[0])+1])
                    elif i==len(m)-1 and j==0:p.append([(i*len(m[0]))+j+1,(i*len(m[0]))+j-len(m[0]),(i*len(m[0]))+j-len(m[0])+1])
                    elif i==0 and j==len(m[0])-1:p.append([j-1,j+len(m[0])-1,j+len(m[0])])
                    elif i==len(m)-1 and j==len(m[0])-1:p.append([(i*len(m[0]))+j-1,(i*len(m[0]))+j-len(m[0]),(i*len(m[0]))+j-len(m[0])-1])
                elif len(m[0])>2 and j == 0:p.append([(len(m[0])*i)+j+1,(len(m[0])*i)+j+len(m[0]),(len(m[0])*i)+j+len(m[0])+1,(len(m[0])*i)+j-len(m[0])+1,(len(m[0])*i)+j-len(m[0])])
                elif len(m[0])>2 and j==len(m[0])-1:p.append([(len(m[0])*i)+j-1,(len(m[0])*i)+j+len(m[0])-1,(len(m[0])*i)+j+len(m[0]),(len(m[0])*i)+j-len(m[0]),(len(m[0])*i)+j-len(m[0])-1])
                elif len(m[0])>2 and j in list(range(1,len(m[0])-1)) and i>0 and i<len(m)-1:p.append([(len(m[0])*i)+j-1,(len(m[0])*i)+j+1,(len(m[0])*i)+j+len(m[0])-1,(len(m[0])*i)+j+len(m[0]),(len(m[0])*i)+j+len(m[0])+1,(len(m[0])*i)+j-len(m[0])+1,(len(m[0])*i)+j-len(m[0]),(len(m[0])*i)+j-len(m[0])-1])
                elif i==0 and j>0:p.append([(len(m[0])*i)+j-1,(len(m[0])*i)+j+1,(len(m[0])*i)+j+len(m[0]),(len(m[0])*i)+j+len(m[0])+1])
                elif i==len(m)-1 and j>0:p.append([(len(m[0])*i)+j-1,(len(m[0])*i)+j+1,(len(m[0])*i)+j-len(m[0])+1,(len(m[0])*i)+j-len(m[0]),(len(m[0])*i)+j-len(m[0])-1])
        return p
    def s(q,p):
        k=q.n(p)
        global pp,cc,l
        pp=[]
        cc=[]
        for i in p:
            pp.extend(i)
        o=0
        for i in k:
            i=[pp[j] for j in i]
            a=i.count(1)
            b=i.count(0)
            if pp[o]==1 and a<2 and a>3:cc.append(0)
            elif pp[o]==1 and a in [2,3]:cc.append(1)
            elif pp[o]==0 and a==3:cc.append(1)
            else:cc.append(0)
            o+=1
        o=0
        u=len(p[0])
        l=[]
        for i in range(len(cc)//len(p[0])):
            l.append(list(cc[o:u]))
            o=u
            u+=len(p[0])
        return l
        
        
            
    
                
    

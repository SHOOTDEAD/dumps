import pandas as pd
import polars as pl
import io
from . import config
from . import errors
import base64

class verify:
    def __init__(self,filename, bdata,unique_columns=config.unique_columns, date_format = config.date_format, date_time_column =config.date_time_column,
                 mandatory_column_dtypes=config.mandatory_column_dtypes,mandatory_columns=config.mandatory_columns, file_size_limit=config.file_size_max_mb,
                 column_length=config.column_lenght ):
        self.bdata = bdata
        self.filename = filename
        self.file_size_limit = file_size_limit * 1000000
        self.column_length = column_length[0]
        self.is_unique = True
        self.dict_dtypes={'Int8': pl.Int8,
             'Int16': pl.Int16,
             'Int32':pl.Int32,
             'Int64': pl.Int64,
             'UInt8': pl.UInt8,
             'Utf8':pl.Utf8,
            
             'UInt16':  pl.UInt16,
             'UInt32':  pl.UInt32,
             'UInt64':  pl.UInt64,
             'Float32': pl.Float32,
             'Float64': pl.Float64,
             'Time': pl.Time,
             'Date': pl.Date,
             'Datetime': pl.Datetime}

        self.unique_columns = unique_columns[0]
        self.mandatory_columns = mandatory_columns[0]
        self.mandatory_column_dtypes = [self.dict_dtypes[i] for i in mandatory_column_dtypes[0]]
        self.date_time_column = date_time_column[0]
        self.error = None
        self.date_format = date_format
        self.func_call = {'XLSX': self.xlsx_xlsm_check, 'XLSM': self.xlsx_xlsm_check, 'CSV': self.csv_check, 'XML': self.xml_check}
       
    def check_file_type(self):
         try:
            self.file_type = self.filename.split('.')[-1].upper()
            self.func_call[self.file_type]
            return self.file_type
         except:
            self.error = errors.file_type_e.format(self.file_type)
            return 0
    def check_mandatory_columns(self):
        for i in self.mandatory_columns:
            if i in self.df.columns:
                pass
            else:
                self.error = errors.mandatory_col_e
                return 0
        return 1
    def check_column_type(self):
        
        for i,j in zip(self.mandatory_column_dtypes,self.mandatory_columns):
            if self.df[j].dtype == i:
              pass
            else:
                self.error = errors.column_type_e
                return 0
        return 1
        
    
    def check_date_format(self):
        if len(self.date_time_column) == 0:
            return 1
        try:
            for i in self.date_time_column:
                self.df = self.df.with_columns(pl.col(i).str.strptime(pl.Date, self.date_format))
        except:
            self.error = errors.date_format_e.format(i,self.date_format)
            return 0
        
        return 1
   
    def _column_length(self):
        if len(self.df.columns) <= self.column_length:
            return 1
        self.error= errors.column_length_e
    def unique_col(self):
        if len(self.unique_columns) == 0:
            return 1
        for i in self.unique_columns:
            if len(self.df[i]) == len(self.df[i].unique()):
                pass
            else:
                self.error = errors.unique_col_e.format(i)
                return 0
        return 1
    def csv_check(self):
        try:
            self.df = pl.read_csv(io.BytesIO(self.bdata))
            self.df = self.df.unique()
            self.temp_df=self.df
        except pl.exceptions.NoDataError :
                self.error = errors.empty_e
                return 0
        except :   
            
            self.error = errors.corrupted_file_e
            return 0
        if self.df.shape[0] == 0:
            self.error = errors.empty_e
            return 0
       
        if self._column_length():
            if self.check_mandatory_columns():
                if self.check_date_format():
                    if self.unique_col():
                        if self.check_column_type():
                            self.bdata = self.temp_df.to_pandas().to_csv(index=False).encode()
                            return 1
        return 0
    def xlsx_xlsm_check(self):
        try:
            self.df = pl.read_excel(io.BytesIO(self.bdata))
            
            self.df = self.df.unique()
            self.temp_df=self.df
        except pl.exceptions.NoDataError :
                self.error = errors.empty_e
                return 0
        except :
           
            self.error = errors.corrupted_file_e
            return 0
        if self.df.shape[0] == 0:
            self.error = errors.empty_e
        
        if self._column_length():
            if self.check_mandatory_columns():
                if self.check_date_format():
                    if self.unique_col():
                        if self.check_column_type():
                           temp_pointer=io.BytesIO()
                           self.bdata = self.df.to_pandas().to_excel(temp_pointer,index=False)
                           temp_pointer.seek(0)
                           self.bdata=base64.encodebytes(temp_pointer.read())
                           return 1
                            
        return 0
    def xml_check(self):
        try:
            self.df = pd.read_xml(io.BytesIO(self.bdata))
            if self.df.isnull().sum().values.sum() == sum(self.df.shape):
                self.error = errors.xml_mutiple_tables_e
                return 0
            self.df = pl.from_pandas(self.df).unique()
            self.temp_df = self.df
            
        except pl.exceptions.NoDataError :
                self.error = errors.empty_e
                return 0
        except :
            self.error = errors.corrupted_file_e
            return 0
        
        
        for i in self.df.columns:
            if self.df[i].unique()[0] == None and len(self.df[i].unique()) <= 1:
                self.error = errors.xml_multivalued_column_e
            
                return 0
        
        if self.is_unique == False:
           self.bdata = self.xml.to_pandas().to_csv(index=False).encode()
        if self._column_length():
            if self.check_mandatory_columns():
                if self.check_date_format():
                    if self.unique_col():
                        if self.check_column_type():
                            self.bdata = self.temp_df.to_pandas().to_xml(index=False).encode()
                            return 1
                            
        return 0
    def check_size(self):
        if len(self.bdata) > self.file_size_limit:
             self.file_data = None
             self.error = errors.file_size_e
             return 0    
        return 1
       
    def func(self):
        if self.check_size():
            x=self.check_file_type()
            if x:
                if self.func_call[x]():
                    return self.bdata
        return self.error
export function normalizeContact(c = {}) {
    return {
        id: c.ID ?? c.id ?? '',
        callerId: c.CallerID ?? c.callerId ?? '',
        queryId: c.QueryID ?? c.QID ?? c.queryId ?? '',
        name: c.Name ?? '',
        cnic: c.CNIC ?? '',
        phoneNo: c.PhoneNo ?? c.ContactNumber ?? '',
        cellNo: c.CellNO ?? c.CellNo ?? '',
        address: c.Address ?? '',
        city: c.City ?? '',
        district: c.District ?? c.AdditionalInfo2 ?? '',
        province: c.Province ?? c.AdditionalInfo3 ?? '',
        country: c.Country ?? c.AdditionalInfo4 ?? '',
        heardFrom: c.HeardFrom ?? c.AdditionalInfo5 ?? '',
        religion: c.Religion ?? c.AdditionalInfo6 ?? '',
        maritalStatus: c.MaritalStatus ?? c.AdditionalInfo8 ?? '',
        remarks: c.Remarks ?? c.AdditionalInfo9 ?? '',
        callbackTwo: c.CallbackTwo ?? c.AdditionalInfo10 ?? '',
        salary: c.Salary ?? c.AdditionalInfo1 ?? '',
        gender: c.Gender ?? '',
        age: c.Age ?? '',
    };
}

export function normalizeComplaint(r = {}) {
    return {
        queryId: r.QueryID ?? r.QID ?? '',
        mainCat: r.Category ?? r.MainCat ?? '',
        category: r.SubCategory ?? r.Category ?? '',
        subCategory: r.SubCatChild ?? r.AdditionalInfo5 ?? '',
        complaintSource: r.ComplaintSource ?? '',
        priority: r.Priority ?? '',
        smsText: r.SMSText ?? '',
        query: r.Query ?? '',
        solution: r.Solution ?? '',
        flags: {
            adrQuery: (r.AdditionalInfo1 || '').trim() === 'ADR Query',
            covid: (r.COVID || '').trim() === 'COVID-19',
            ageAboveFifty: (r.AgeAboveFifty || '').trim() === 'Age > 50',
            dv: (r.Domesticviolence || '').trim() === 'Gender Base Violence',
            womenRelated: (r.AdditionalInfo2 || '').trim() === 'Women Related',
            womenProperty: (r.WomenProperty || '').trim() === 'Women Property',
            shortQuery: ((r.AdditionalInfo8 ?? r.ShortQuery) ?? '').toString() === '1',
        },
    };
}